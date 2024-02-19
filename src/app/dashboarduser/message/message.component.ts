import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as express from "express";
import { UserService } from 'src/app/auth/user.service';
import { io } from 'socket.io-client';


// Sample User and Message classes
class User {
  constructor(public id: number, public name: string) { }
}

class SendMessage {
  constructor(public messageTo: string, public messageFrom: string, public message: string) { }
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  empidMap: { [key: string]: string } = {};
  employerNames: { [messageFrom: string]: string } = {};
  messages: SendMessage[] = [];
  selectedUser: string | null = null;
  filteredMessages: SendMessage[] = [];
  userID: any;
  userData1: any;
  abc: any;
  newMessage: string = '';
  socket: any;

  constructor(private http: HttpClient, private router: Router, public cookie: CookieService, private b1: UserService) { }

  ngOnInit(): void {
    this.userID = this.cookie.get('uid');

    // Connect to Socket.IO server
    this.socket = io('http://164.92.121.188:4444');

    // Subscribe to Socket.IO events
    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    // Fetch user data
    let response = this.b1.fetchuser();

    response.subscribe((data1: any) => {
      const uuid = this.userID;
      this.userData1 = data1.find((user: any) => user.uid == uuid);
      this.abc = this.userData1.uid;
    });

    // Fetch messages
    this.fetchMessages();
  }

  fetchMessages() {
    const uniqueNames = new Set<string>();

    // Fetch messages from API
    this.http.get<SendMessage[]>('https://job4jobless.com:9001/fetchMessages').subscribe((messages: SendMessage[]) => {
      this.messages = messages.filter((message) => {
        if (!uniqueNames.has(message.messageFrom) && (message.messageTo == this.userID)) {
          uniqueNames.add(message.messageFrom);
          return message.messageTo === this.userID;
        }
        return false;
      });
      this.loadEmployerNames();
    });

    // Fetch filtered messages
    this.fetchMyMessages();
  }

  loadEmployerNames() {
    const uniqueMessageFromValues = Array.from(new Set(this.messages.map((message) => message.messageFrom)));
    
    // Fetch employer data, including empid and name
    this.b1.fetchemployer().subscribe((employerData: any) => {
      if (Array.isArray(employerData)) {
        for (const messageFrom of uniqueMessageFromValues) {
          const matchingEmployer = employerData.find((employer: any) => employer.empid === messageFrom);
          if (matchingEmployer) {
            // Matching employer found, store the name in employerNames
            this.employerNames[messageFrom] = matchingEmployer.empfname;
          }
        }
      } else {
        console.error('Received employer data is not an array');
      }
    });
  }

  fetchMyMessages() {
    // Fetch messages from API
    this.http.get<SendMessage[]>('https://job4jobless.com:9001/fetchMessages').subscribe((messages: SendMessage[]) => {
      this.filteredMessages = [];
      const uniqueMessageIds = new Set<string>();

      for (const message of messages) {
        const messageIdentifier = `${message.messageFrom}_${message.messageTo}_${message.message}`;
        if (!uniqueMessageIds.has(messageIdentifier)) {
          uniqueMessageIds.add(messageIdentifier);
          if (
            (message.messageFrom === this.selectedUser && message.messageTo === this.abc) ||
            (message.messageFrom === this.abc && message.messageTo === this.selectedUser)
          ) {
            this.filteredMessages.push(message);
          }
        }
      }
    });
  }

  selectUser(user: string) {
    this.selectedUser = user;
    this.fetchMyMessages();
  }

  sendMessage() {
    if (this.selectedUser && this.newMessage.trim() !== '') {
      const messageToSend = new SendMessage(this.selectedUser, this.abc, this.newMessage);

      // Emit 'sendMessage' event to the server
      this.socket.emit('sendMessage', messageToSend);

      // Clear the newMessage input field
      this.newMessage = '';
    }
  }

  startVideoCall() {
    if (this.selectedUser) {
      // Route to the video call page with the selected user as a route parameter
      this.router.navigate(['/dashboarduser/videocall', this.selectedUser]); // Adjust the route as per your project's configuration
    }
  }
}
