import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/auth/user.service';
import { CookieService } from 'ngx-cookie-service';
import { io } from 'socket.io-client';
import { FormBuilder, Validators } from '@angular/forms';

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
    messages!: SendMessage[];
    socket: any;

    constructor(private http: HttpClient, private route: ActivatedRoute,
        private cookie: CookieService, private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.uid = this.route.snapshot.paramMap.get("uid");
        this.message.messageFrom = this.cookie.get('emp');
        this.fetchMessages();
        this.initSocketConnection();

        this.messageForm = this.formBuilder.group({
            messageFrom: [this.message.messageFrom, Validators.required],
            messageTo: [this.uid, Validators.required],
            message: [this.message.message, Validators.required]
        });
    }

    initSocketConnection() {
        // Connect to the Socket.IO server using HTTPS
        this.socket = io('https://rocknwoods.website:4444');

        // Event: Socket Error
        this.socket.on('error', (error: any) => {
            console.error('Socket Error:', error);
        });
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
                    (message.messageTo === this.uid &&
                        message.messageFrom === this.message.messageFrom) ||
                    (message.messageTo === this.message.messageFrom &&
                        message.messageFrom === this.uid)
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
            this.socket.emit('message', messageToSend); // Send message via Socket.IO
            
            this.http.post<SendMessage>('https://job4jobless.com:9001/send', messageToSend).subscribe({
                next: (response: any) => {
                    this.messageForm.patchValue({
                        message: '',
                        previousMessage: response.message,
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
