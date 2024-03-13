import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { backendUrl } from 'src/app/constant';


@Component({
  selector: 'app-dashboardadmin',
  templateUrl: './dashboardadmin.component.html',
  styleUrls: ['./dashboardadmin.component.css']
})

export class DashboardadminComponent implements OnInit{
  router: any;
  isContentVisible: boolean = false;

constructor( private cookie:CookieService , private http: HttpClient){

}
  ngOnInit(): void {

  }
  private backend_URL = `${backendUrl}`;
  
  signOutAdmin(){
    const refreshToken = this.cookie.get('refreshToken');

    if (!refreshToken) {
      return;
    }
  
 
    this.http.post(`${this.backend_URL}adminlogout`, null, {
      responseType: 'text' 
    }).subscribe({
      next: (response: string) => {
        if (response === 'Logout successful') {
    this.cookie.delete('accessToken');
        this.cookie.delete('refreshToken');
        this.cookie.delete('adminid');
          // alert("LogOut Successfull");
          this.router.navigate(['/adminlogin']);
        } else {
          this.cookie.delete('accessToken');
          this.cookie.delete('refreshToken');
          this.cookie.delete('adminid');
            // alert("LogOut Successfull");
            this.router.navigate(['/adminlogin']);
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

  // toggleContent() {
  //   this.isContentVisible = !this.isContentVisible;
  // }

}
