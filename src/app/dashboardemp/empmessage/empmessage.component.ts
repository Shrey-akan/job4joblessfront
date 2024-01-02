import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { UserService } from 'src/app/auth/user.service';
import { CookieService } from 'ngx-cookie-service';
import { __importDefault } from 'tslib';
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


  message: SendMessage = new SendMessage(); // Initialize an empty message
  uid!: string | null;
  messageForm!: any;
  messages!: SendMessage[];

  constructor(private http: HttpClient, private route: ActivatedRoute,
    private cookie: CookieService,private formBuilder: FormBuilder) {
  }
  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get("uid");
  // console.log("uid:", this.uid); 
    // Get the "to" value from the cookie (assuming "empemailid" is the cookie name)
    this.message.messageFrom = this.cookie.get('emp');
    // console.log(this.message.messageFrom);
    // console.log(this.uid);

    this.fetchMessages();
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
            (message.messageTo === this.uid &&
            message.messageFrom === this.message.messageFrom)||
            (message.messageTo === this.message.messageFrom &&
              message.messageFrom === this.uid)
            
        );

        // If relevant messages are found, set the previousMessage field
        if (this.messages.length > 0) {
          this.messageForm.patchValue({
            previousMessage: this.messages[this.messages.length - 1].message,
          });
        }
      });
  }

  sendMessage() {
    if (this.messageForm.valid) {
      const messageToSend = this.messageForm.value;

      // Make an HTTP POST request to send the message
      this.http
        .post<SendMessage>('https://job4jobless.com:9001/send', messageToSend)
        .subscribe({
          next: (response: any) => {
            // console.log('Message sent successfully:', response);
            // Optionally, reset the form
            this.messageForm.patchValue({
              message: '',
              previousMessage: response.message, // Set previousMessage to the sent message
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
