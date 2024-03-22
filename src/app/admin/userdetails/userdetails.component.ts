import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constant';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {
  data: any;
  private backend_URL = `${backendUrl}`;
  currentPage = 1;
  itemsPerPage = 10;
  loadNextPage() {
    this.currentPage++;
  }

  loadPreviousPage() {
    this.currentPage--;
  }

  constructor(private b1: UserService, private router: Router, private http: HttpClient) { }
  ngOnInit(): void {
    let responce = this.b1.fetchuser();
    responce.subscribe((data1: any) =>
      this.data = data1
      // this.data = data1.filter((user: any) => !user.accdeactivate)
    );
  }
  sendNotification(userId: string) {
    // Navigate to the notification component with the user ID as a parameter
    this.router.navigate(['/admin/notify/', userId]);
  }

  deleteUser(userId: string): void {
    this.http.delete(`${this.backend_URL}users/${userId}`).subscribe({
      next: () => {
        console.log('User account deactivated successfully');
        // Optionally, update UI or perform other actions upon successful deletion
      },
      error: (error) => {
        console.error('Error deactivating user account:', error);
        // Handle error scenarios
      }
    });
  }

  toggleUserActivation(uid: string): void {
    this.http.put(`${this.backend_URL}deactivate/${uid}`, {}).subscribe({
      next: () => {
        console.log(`User account ${uid} ${this.getUserById(uid).accdeactivate ? 'activated' : 'deactivated'} successfully`);
        // Update the user's accdeactivate status in the UI
        this.getUserById(uid).accdeactivate = !this.getUserById(uid).accdeactivate;
      },
      error: (error) => {
        console.error(`Error toggling user activation status for user ${uid}:`, error);
        // Handle error scenarios
      }
    });
  }

  getUserById(userId: string): any {
    return this.data.find((user: any) => user.uid === userId);
  }
}
