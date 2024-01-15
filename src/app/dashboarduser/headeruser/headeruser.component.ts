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

    const refreshToken = this.cookie.get('refreshToken');

    if (!refreshToken) {
      return;
    }
  
 
    this.http.post('https://job4jobless.com:9001/logout', null, {
      responseType: 'text' 
    }).subscribe({
      next: (response: string) => {
        if (response === 'Logout successful') {
    this.cookie.delete('accessToken');
        this.cookie.delete('refreshToken');
        this.cookie.delete('uid');
          // alert("LogOut Successfull");

          this.router.navigate(['/login']);
        } else {

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