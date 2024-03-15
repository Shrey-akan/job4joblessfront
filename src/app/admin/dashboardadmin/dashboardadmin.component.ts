import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { backendUrl } from 'src/app/constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboardadmin',
  templateUrl: './dashboardadmin.component.html',
  styleUrls: ['./dashboardadmin.component.css']
})

export class DashboardadminComponent implements OnInit {
  // router: any;
  isContentVisible: boolean = false;

  constructor(private cookie: CookieService, private http: HttpClient , private router: Router) {

  }
  ngOnInit(): void {

  }
  private backend_URL = `${backendUrl}`;

  signOutAdmin() {
    const refreshToken = this.cookie.get('refreshToken');
  
    if (!refreshToken) {
      return;
    }
  
    this.http.post(`${this.backend_URL}adminlogout`, null, {
      responseType: 'text'
    }).subscribe({
      next: (response: string) => {
        console.log(response);
        if (response === 'Logout successful') {
          console.log(response);
          this.cookie.delete('accessToken');
          this.cookie.delete('refreshToken');
          this.cookie.delete('adminid');
          this.router.navigate(['/adminlogin']);
        } else {
          console.error('Logout failed:', response);
          // Optionally, you can handle the failure case here,
          // such as displaying an error message to the user.
        }
      },
      error: (error) => {
        console.error('Logout error', error);
        // Handle errors if the logout request fails
        // For example, you can display an error message or log the error.
      }
    });
  }

  // signOutAdmin(): void {
  //   // Perform logout actions here
  //   // For example, clear cookies, redirect to login page, etc.
  //   // This example assumes you're using ngx-cookie-service for managing cookies

  //   // Clear cookies
  //   this.cookie.delete('accessToken');
  //   this.cookie.delete('refreshToken');
  //   this.cookie.delete('adminid');

  //   // Redirect to login page
  //   this.router.navigate(['/adminlogin']);
  // }
  

  // toggleContent() {
  //   this.isContentVisible = !this.isContentVisible;
  // }

}
