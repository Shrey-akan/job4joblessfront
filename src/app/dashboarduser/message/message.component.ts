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
  userData1: any;
  abc: string | null = null; // Declare abc property
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

    // Initialize socket connection
    this.initSocketConnection();

    // Fetch messages
    this.fetchMessages();
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  initSocketConnection(): void {
    if (!this.userID) {
      console.error('UserID is missing.');
      return;
    }
  
    // Connect to the Socket.IO server using secure WebSocket (wss://)
    this.socket = io('https://rocknwoods.website:4400', {
      query: {
        sourceId: this.userID,
        targetId: null // Target ID will be set when an employer is selected
      }
    });
  
    // Event: Socket connected
    this.socket.on('connect', () => {
      console.log('Socket connected');
  
      // Emit the 'join' event with the userID (uid)
      this.socket.emit('join', this.userID);
    });
    
    // Event: Socket connection error
    this.socket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
    });
  
    // Event: Socket disconnected
    this.socket.on('disconnect', (reason: any) => {
      console.log('Socket disconnected:', reason);
    });
  }
  

  fetchMessages(): void {
    if (!this.userID) {
      console.error('UserID is missing.');
      return;
    }

    this.http.get<SendMessage[]>('https://job4jobless.com:9001/fetchMessages').subscribe((messages: SendMessage[]) => {
      // Filter messages based on user ID
      this.messages = messages.filter(message => message.messageTo === this.userID);
      // Load employer names for the filtered messages
      this.loadEmployerNames();
    });

    // Fetch my messages
    this.fetchMyMessages();
  }

  loadEmployerNames(): void {
    const uniqueMessageFromValues = Array.from(new Set(this.messages.map(message => message.messageFrom)));
    
    this.b1.fetchemployer().subscribe((employerData: any) => {
      if (Array.isArray(employerData)) {
        for (const messageFrom of uniqueMessageFromValues) {
          const matchingEmployer = employerData.find(employer => employer.empid === messageFrom);
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
    if (!this.userID) {
      console.error('UserID is missing.');
      return;
    }

    this.http.get<SendMessage[]>('https://job4jobless.com:9001/fetchMessages').subscribe((messages: SendMessage[]) => {
      // Filter messages based on selected user and userID
      this.filteredMessages = messages.filter(message =>
        (message.messageFrom === this.selectedUser && message.messageTo === this.userID) ||
        (message.messageFrom === this.userID && message.messageTo === this.selectedUser)
      );
    });
  }

  selectUser(user: string): void {
    this.selectedUser = user;
    
    if (this.socket && this.socket.io && this.socket.io.opts && this.socket.io.opts.query) {
      this.socket.io.opts.query['targetId'] = user;
      console.log('Source ID:', this.userID);
      console.log('Target ID:', user);
    }
    this.fetchMyMessages();
  }

  sendMessage(): void {
    if (this.selectedUser && this.newMessage.trim() !== '') {
      const messageToSend = new SendMessage(this.selectedUser, this.userID!, this.newMessage);

      // Send message via Socket.IO
      if (this.socket) {
        this.socket.emit('sendMessage', messageToSend);
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
