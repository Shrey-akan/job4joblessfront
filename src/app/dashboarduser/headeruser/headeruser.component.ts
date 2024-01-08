import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-headeruser',
  templateUrl: './headeruser.component.html',
  styleUrls: ['./headeruser.component.css']
})
export class HeaderuserComponent implements OnInit {
  userEmail!: string;
  accessToken: string | null;
  uid: string | null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private cookie: CookieService) {
    // Initialize properties from local storage
    this.accessToken = localStorage.getItem('accessToken');
    this.uid = localStorage.getItem('uid');
  }

  ngOnInit() {
    // Retrieve the email from the query parameters
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'];
    });
  }
  logout() {
    // Retrieve the refresh token from the cookie
    const refreshToken = this.cookie.get('refreshToken');
    // console.log('Refresh token:', refreshToken);
  
    // Ensure refreshToken is not empty
    if (!refreshToken) {
      // console.log('Refresh token is missing.');
      return;
    }
  
    // Make the logout request with the refresh token as a request parameter
    this.http.post('https://job4jobless.com:9001/logout', null, {
      responseType: 'text' // Specify the response type as 'text'
    }).subscribe({
      next: (response: string) => {
        // console.log('Logout response:', response);
        
        // Assuming the response is a simple message like "Logout successful"
        if (response === 'Logout successful') {
    this.cookie.delete('accessToken');
        this.cookie.delete('refreshToken');
        this.cookie.delete('uid');
          // Handle the successful logout response
          // console.log('Logout successful');
          
        
          alert("LogOut Successfull");
          // Navigate to the login page or any other desired route
          this.router.navigate(['/login']);
        } else {
          // Handle other responses or errors
          // console.log('Logout failed:', response);
        }
      },
      error: (error) => {
        // Handle errors if the logout request fails
        // console.log('Logout error', error);
        // console.log('HTTP Status:', error.status);
        // console.log('Error Message:', error.message);
        // You can add additional error handling here if needed
      }
    });
  }
  signto() {
    this.router.navigate(['/']);
  }

}