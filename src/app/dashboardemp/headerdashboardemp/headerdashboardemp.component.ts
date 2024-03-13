import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { backendUrl } from 'src/app/constant';
interface ApiResponse {
  waitingApplicationsCount:number;
  jobidWaitingCountMap: Record<string, number>;
}
@Component({
  selector: 'app-headerdashboardemp',
  templateUrl: './headerdashboardemp.component.html',
  styleUrls: ['./headerdashboardemp.component.css']
})
export class HeaderdashboardempComponent implements OnInit {
  showNavbaremp = true;
  waitingApplicationsCount: number = 0;
  empId: String = "0";
  jobWaitingCounts!: number;
  private backend_URL = `${backendUrl}`;
  constructor(private router: Router, private http: HttpClient, private cookie: CookieService) { }

  ngOnInit() {
    this.empId = this.cookie.get('emp');
    this.getWaitingApplicationsCount();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;

        // Check if the current route is 'employer'
        this.showNavbaremp = !['/employers/sign-in-checkemp'].includes(currentRoute);
      }
    });
  }
  getWaitingApplicationsCount() {
    const empid = this.empId;

    this.http.get<ApiResponse>(`${this.backend_URL}notifyEmployer?empid=${empid}`)
      .subscribe({
        next: (response:ApiResponse) => {
          console.log(response);
          this.waitingApplicationsCount = response.waitingApplicationsCount;
          console.log("checking this console",this.waitingApplicationsCount);
        },
        error: (error) => {
          console.error('Error fetching waiting applications count:', error);
        }
      });
  }



  logoutEmployer() {
    // Retrieve the refresh token from the cookie
    const refreshToken = this.cookie.get('refreshToken');
    // console.log('Refresh token:', refreshToken);

    // Ensure refreshToken is not empty
    if (!refreshToken) {
      // console.log('Refresh token is missing.');
      return;
    }

    // Make the logout request with the refresh token as a request parameter
    this.http.post(`${this.backend_URL}logoutEmployer`, null, {
      responseType: 'text' // Specify the response type as 'text'
    }).subscribe({
      next: (response: string) => {
        // console.log('Logout response:', response);

        // Assuming the response is a simple message like "Logout successful"
        if (response === 'Logout successful') {
          this.cookie.delete('refreshToken');
          this.cookie.delete('accessToken');
          this.cookie.delete('emp');
          // Handle the successful logout response
          // console.log('Logout successful');

          alert('Logout successful');
          // Navigate to the employer login page or any other desired route
          this.router.navigate(['/employer']);
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

}
