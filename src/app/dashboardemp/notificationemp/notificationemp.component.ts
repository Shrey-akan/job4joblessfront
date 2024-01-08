import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-notificationemp',
  templateUrl: './notificationemp.component.html',
  styleUrls: ['./notificationemp.component.css']
})
export class NotificationempComponent implements OnInit {
  notifications: any[] = [];
  empId: string = "0";
  isLoading: boolean = false;

  constructor(private notificationService: UserService, public cookie: CookieService) {}

  ngOnInit(): void {
    this.empId = this.cookie.get('emp');
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.isLoading = true;
    this.notificationService.fetchnotify().subscribe({
      next: (response: any) => {
        // console.log('Fetched notifications:', response);
        
        // Filter notifications based on the user ID
        this.notifications = response.filter((notification: any) => {
          return notification.notifyuid === this.empId;
        });

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching notifications:', err);
        this.isLoading = false;
      }
    });
  }

  refreshNotifications(): void {
    // Implement the logic to refresh notifications here if needed
    // You can call this method when the "Refresh" button is clicked
    this.fetchNotifications();
  }
}
