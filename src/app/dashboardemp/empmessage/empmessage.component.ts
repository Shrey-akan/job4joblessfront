import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/auth/user.service';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, Validators } from '@angular/forms';
import { io } from 'socket.io-client'; // Import io from socket.io-client

class SendMessage {
  messageTo!: string;
  messageFrom!: string;
  message!: string;
}

@Component({
  selector: 'app-empmessage',
  templateUrl: './empmessage.component.html',
  styleUrls: ['./empmessage.component.css']
})
export class EmpmessageComponent implements OnInit {
  message: SendMessage = new SendMessage();
  uid!: string | null;
  messageForm!: any;
  messages: SendMessage[] = [];
  socket: any;

  constructor(private http: HttpClient, private route: ActivatedRoute,
    private cookie: CookieService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get("uid");
    this.message.messageFrom = this.cookie.get('emp');

    this.socket = io('http://164.92.121.188:4444');

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    this.fetchMessages(); // Fetch messages when component initializes
    this.messageForm = this.formBuilder.group({
      messageFrom: [this.message.messageFrom, Validators.required],
      messageTo: [this.uid, Validators.required],
      message: [this.message.message, Validators.required]
    });
  }

  fetchMessages() {
    // Fetch previous messages from the server
    this.http
      .get<SendMessage[]>('https://job4jobless.com:9001/fetchMessages')
      .subscribe((messages: SendMessage[]) => {
        // Filter messages to only include the relevant ones
        this.messages = messages.filter(
          (message) =>
            (message.messageTo === this.uid && message.messageFrom === this.message.messageFrom) ||
            (message.messageTo === this.message.messageFrom && message.messageFrom === this.uid)
        );
      });
  }

  sendMessage() {
    if (this.messageForm.valid) {
      const messageToSend = this.messageForm.value;

      // Send message via Socket.IO
      this.socket.emit('sendMessage', messageToSend);

      // Save the message locally
      this.messages.push(messageToSend);

      // Make an HTTP POST request to send the message
      this.http
        .post<SendMessage>('https://job4jobless.com:9001/send', messageToSend)
        .subscribe({
          next: (response: any) => {
            this.messageForm.patchValue({
              message: '',
              previousMessage: response.message,
            });
          },
          error: (err: any) => {
            console.error('Error sending message:', err);
          },
        });
    }
  }
}
