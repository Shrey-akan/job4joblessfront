import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboardadmin',
  templateUrl: './dashboardadmin.component.html',
  styleUrls: ['./dashboardadmin.component.css']
})
export class DashboardadminComponent implements OnInit{
  router: any;

constructor( private cookie:CookieService , private http: HttpClient){

}
  ngOnInit(): void {

  }

  signOutAdmin(){
    const refreshToken = this.cookie.get('refreshToken');

    if (!refreshToken) {
      return;
    }
  
 
    this.http.post('https://job4jobless.com:9001/adminlogout', null, {
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

}
