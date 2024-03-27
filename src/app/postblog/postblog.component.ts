import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { blogconst } from 'src/app/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-postblog',
  templateUrl: './postblog.component.html',
  styleUrls: ['./postblog.component.css']
})
export class PostblogComponent implements OnInit {

  constructor(private router: Router, private cookieService: CookieService) { }
  ngOnInit(): void {
    const currentUrl = window.location.href;

    // Extract the token from the URL
    const tokenStartIndex = currentUrl.lastIndexOf('/') + 1; // Find the index of the last '/'
    const token = currentUrl.substring(tokenStartIndex); // Extract the token from the URL

    // Print the token to the console
    console.log("Token:", token);
    // const accessToken = this.cookieService.get('access_token');
    // this.filterBlogs();
  }
  createBlog(): void {
    const currentUrl = window.location.href;
    const tokenStartIndex = currentUrl.lastIndexOf('/') + 1;
    const token = currentUrl.substring(tokenStartIndex);
    console.log("Your access toke is: ",token)
    this.router.navigate(['createblog'], { queryParams: { token:token } });
  }

  logout(): void {

    // Clear the token from where it's stored (e.g., cookies)
    this.cookieService.delete('access_token');

    // localStorage.removeItem('access_token');

    // Navigate to the desired route after logout (e.g., home page)
    this.router.navigate(['/blogs']);
  }
}
