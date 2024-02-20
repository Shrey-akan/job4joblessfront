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
  empid: string;
  uid: string | null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private cookie: CookieService,
    private formBuilder: FormBuilder
  ) {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required]
    });

    // Retrieve empid from cookie and uid from route parameters
    this.empid = this.cookie.get('emp');
    this.uid = this.route.snapshot.paramMap.get("uid");

    // Initialize the socket connection
    this.initSocketConnection();
  }

  ngOnInit(): void {
    // Fetch previous messages on component initialization
    this.fetchMessages();
  }

  initSocketConnection() {
    // Connect to the Socket.IO server using secure WebSocket (wss://)
    this.socket = io('https://165.227.66.176:4444', {
      transports: ['websocket'],
      autoConnect: false,
      query: {
        sourceId: this.empid,
        targetId: this.uid
      }
    });

    // Manually connect the socket
    this.socket.connect();

    // Event: Socket Error
    this.socket.on('error', (error: any) => {
      console.error('Socket Error:', error);
    });

    // Event: Receive message
    this.socket.on('message', (message: SendMessage) => {
      console.log('Received message:', message);
      // Add received message to the messages array
      this.messages.push(message);
    });
  }

  fetchMessages() {
    // Fetch previous messages between the current user (empid) and the target user (uid)
    this.http.get<SendMessage[]>('https://job4jobless.com:9001/fetchMessages').subscribe((messages: SendMessage[]) => {
      // Filter messages to include only those related to the current conversation
      this.messages = messages.filter(
        (message) =>
          (message.messageTo === this.uid && message.messageFrom === this.empid) ||
          (message.messageTo === this.empid && message.messageFrom === this.uid)
      );

      // If there are previous messages, display the last message in the form
      if (this.messages.length > 0) {
        this.messageForm.patchValue({
          message: this.messages[this.messages.length - 1].message,
        });
      }
    });
  }

  sendMessage() {
    if (this.messageForm.valid && this.uid) {
      const messageToSend = {
        messageTo: this.uid,
        messageFrom: this.empid,
        message: this.messageForm.value.message
      };

      console.log('Sending message:', messageToSend);

      // Send the message via Socket.IO
      this.socket.emit('message', messageToSend);
      
      // Send the message to the server API as well
      this.http.post<SendMessage>('https://job4jobless.com:9001/send', messageToSend).subscribe({
        next: (response: any) => {
          console.log('API Response:', response);
          // Clear the message input after sending
          this.messageForm.patchValue({
            message: '',
          });
          // Fetch messages again to update the view
          this.fetchMessages();
        },
        error: (err: any) => {
          console.error('Error sending message:', err);
        },
      });
    }
  }
}
