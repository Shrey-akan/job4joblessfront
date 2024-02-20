import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { io, Socket } from 'socket.io-client';

interface SendMessage {
  messageTo: string;
  messageFrom: string;
  message: string;
}

@Component({
  selector: 'app-empmessage',
  templateUrl: './empmessage.component.html',
  styleUrls: ['./empmessage.component.css']
})
export class EmpmessageComponent implements OnInit {
  messageForm: FormGroup;
  messages: SendMessage[] = [];
  socket!: Socket;
  uid: string | null;
  empid: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private cookie: CookieService,
    private formBuilder: FormBuilder
  ) {
    this.messageForm = this.formBuilder.group({
      messageFrom: ['', Validators.required],
      messageTo: ['', Validators.required],
      message: ['', Validators.required]
    });

    this.uid = this.route.snapshot.paramMap.get("uid");
    this.empid = this.cookie.get('emp');
    this.initSocketConnection();
  }

  ngOnInit(): void {
    this.fetchMessages();
  }

  initSocketConnection() {
    // Connect to the Socket.IO server using HTTPS
    this.socket = io('https://rocknwoods.website:4444');

    // Event: Socket Error
    this.socket.on('error', (error: any) => {
      console.error('Socket Error:', error);
    });

    // Event: Receive message
    this.socket.on('message', (message: SendMessage) => {
      // Add received message to the messages array
      this.messages.push(message);
    });
  }

  fetchMessages() {
    // Fetch previous messages from the server
    this.http.get<SendMessage[]>('https://job4jobless.com:9001/fetchMessages').subscribe((messages: SendMessage[]) => {
      this.messages = messages.filter(
        (message) =>
          (message.messageTo === this.uid && message.messageFrom === this.empid) ||
          (message.messageTo === this.empid && message.messageFrom === this.uid)
      );

      if (this.messages.length > 0) {
        this.messageForm.patchValue({
          message: this.messages[this.messages.length - 1].message,
        });
      }
    });
  }

  sendMessage() {
    if (this.messageForm.valid) {
      const messageToSend = this.messageForm.value;
      messageToSend.messageTo = this.uid; // Set the target user ID
      messageToSend.messageFrom = this.empid; // Set the source user ID

      this.socket.emit('message', messageToSend); // Send message via Socket.IO
      
      this.http.post<SendMessage>('https://job4jobless.com:9001/send', messageToSend).subscribe({
        next: (response: any) => {
          this.messageForm.patchValue({
            message: '', // Clear the message input after sending
          });
          this.fetchMessages();
        },
        error: (err: any) => {
          console.error('Error sending message:', err);
        },
      });
    }
  }
}
