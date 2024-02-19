import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { io } from 'socket.io-client';

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
  userID: any;
  userData1: any;
  abc: any;
  newMessage: string = '';
  socket: any;
  filteredMessages: SendMessage[] = [];

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, public cookie: CookieService, private b1: UserService) { }

  ngOnInit(): void {
    this.userID = this.cookie.get('uid');
    this.socket = io('http://164.92.121.188:4444');

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    let response = this.b1.fetchuser();

    response.subscribe((data1: any) => {
      const uuid = this.userID;
      this.userData1 = data1.find((user: any) => user.uid == uuid);
      this.abc = this.userData1.uid;
    });

    this.fetchMessages();
  }

  fetchMessages() {
    const uniqueNames = new Set<string>();

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

    this.socket.on('receiveMessage', (message: SendMessage) => {
      if (message.messageTo === this.userID) {
        this.messages.push(message);
      }
    });
  }

  loadEmployerNames() {
    const uniqueMessageFromValues = Array.from(new Set(this.messages.map((message) => message.messageFrom)));

    this.b1.fetchemployer().subscribe((employerData: any) => {
      if (Array.isArray(employerData)) {
        for (const messageFrom of uniqueMessageFromValues) {
          const matchingEmployer = employerData.find((employer: any) => employer.empid === messageFrom);
          if (matchingEmployer) {
            this.employerNames[messageFrom] = matchingEmployer.empfname;
          }
        }
      } else {
        console.error('Received employer data is not an array');
      }
    });
  }

  sendMessage() {
    if (this.selectedUser && this.newMessage.trim() !== '') {
      const messageToSend = new SendMessage(this.selectedUser, this.abc, this.newMessage);

      this.socket.emit('sendMessage', messageToSend);

      this.http.post<SendMessage>('https://job4jobless.com:9001/send', messageToSend).subscribe({
        next: (response: SendMessage) => {
          this.newMessage = '';
          this.fetchMessages();
        },
        error: (err: any) => {
          console.error('Error sending message:', err);
        }
      });
    }
  }

  startVideoCall() {
    if (this.selectedUser) {
      this.router.navigate(['/dashboarduser/videocall', this.selectedUser]);
    }
  }

  selectUser(user: string) {
    this.selectedUser = user;
    this.fetchMyMessages();
  }

  fetchMyMessages() {
    this.filteredMessages = this.messages.filter(message =>
      (message.messageFrom === this.selectedUser && message.messageTo === this.abc) ||
      (message.messageFrom === this.abc && message.messageTo === this.selectedUser)
    );
  }
}
