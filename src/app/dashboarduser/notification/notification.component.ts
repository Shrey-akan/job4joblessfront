import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: any[] = []; // Initialize with an empty array
  isLoading: boolean = true;

  constructor(private notificationService: UserService, public cookie: CookieService, private router: Router) { }
  userID: string = "0";

  ngOnInit(): void {
    this.userID = this.cookie.get('uid');
    // console.log(this.userID);
    // console.log('User ID from cookie:', this.userID);
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.notificationService.fetchnotify().subscribe({
      next: (response: any) => {
        // console.log('Fetched notifications:', response);
        // Filter notifications based on the user ID
        this.notifications = response.filter((notification: any) => {
          return notification.notifyuid === this.userID;
        });
        this.isLoading = false; // Set isLoading to false when data is available
      },
      error: (err: any) => {
        console.error('Error fetching notifications:', err);
        this.isLoading = false; // Set isLoading to false on error as well
      }
    });
  }

  refreshNotifications() {
    this.isLoading = true; // Set isLoading to true before fetching data
    this.fetchNotifications();
  }



}
