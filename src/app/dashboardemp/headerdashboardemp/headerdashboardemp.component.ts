import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
interface ApiResponse {
  jobidWaitingCountMap: Record<string, number>;
}
@Component({
  selector: 'app-headerdashboardemp',
  templateUrl: './headerdashboardemp.component.html',
  styleUrls: ['./headerdashboardemp.component.css']
})
export class HeaderdashboardempComponent implements OnInit {
  showNavbaremp = true;
  waitingApplicationsCount!: number;
  empId: String = "0";
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
    // Fetch the empid from wherever it's stored (you may need to adapt this part)
    const empid = this.empId;

    // Make the API request to get waiting applications count
    this.http.get<ApiResponse>(`https://job4jobless.com:9001/notifyEmployer?empid=${empid}`)
      .subscribe({
        next: (response) => {
          console.log(response);
          // Handle the response, assuming the API returns an object with a count property
          this.waitingApplicationsCount = response.jobidWaitingCountMap ? Object.values(response.jobidWaitingCountMap).reduce((a, b) => a + b, 0) : 0;
          console.log(this.waitingApplicationsCount);
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
    this.http.post('https://job4jobless.com:9001/logoutEmployer', null, {
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
