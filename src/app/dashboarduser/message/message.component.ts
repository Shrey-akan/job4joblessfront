import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { io, Socket } from 'socket.io-client';
import { UserService } from 'src/app/auth/user.service';

class SendMessage {
  constructor(public messageTo: string, public messageFrom: string, public message: string) { }
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {
  empidMap: { [key: string]: string } = {};
  employerNames: { [messageFrom: string]: string } = {};
  messages: SendMessage[] = [];
  selectedUser: string | null = null;
  filteredMessages: SendMessage[] = [];
  userID: string | null = null;
  abc: string | null = null;
  newMessage: string = '';
  socket!: Socket;

  constructor(
    private http: HttpClient,
    private router: Router,
    public cookie: CookieService,
    private b1: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userID = this.cookie.get('uid');
    this.abc = this.route.snapshot.paramMap.get('empid');

    // Initialize socket connection with source ID (uid) and target ID (empid)
    if (this.userID && this.abc) {
      this.initSocketConnection();
    } else {
      console.error('UserID or empid is missing.');
    }

    this.fetchMessages();
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  initSocketConnection(): void {
    this.socket = io('https://rocknwoods.website:4444', {
      query: {
        sourceId: this.userID,
        targetId: this.abc
      }
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('disconnect', (reason: any) => {
      console.log('Socket disconnected:', reason);
    });
  }

  fetchMessages(): void {
    if (!this.userID) {
      console.error('UserID is missing.');
      return;
    }

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

    this.fetchMyMessages();
  }

  loadEmployerNames(): void {
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

  fetchMyMessages(): void {
    if (!this.userID || !this.abc) {
      console.error('UserID or empid is missing.');
      return;
    }

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

  selectUser(user: string): void {
    this.selectedUser = user;
    this.fetchMyMessages();
  }

  sendMessage(): void {
    if (this.selectedUser && this.newMessage.trim() !== '') {
      const messageToSend = new SendMessage(this.selectedUser, this.abc!, this.newMessage);

      if (this.socket) {
        this.socket.emit('sendMessage', messageToSend); // Send message via Socket.IO
      }

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

  startVideoCall(): void {
    if (this.selectedUser) {
      this.router.navigate(['/dashboarduser/videocall', this.selectedUser]);
    }
  }
}
