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
  isContentVisible: boolean = false;
  userType: string | null = null;
  subadminDetails: any; // Declare subadminDetails property

  constructor(private cookie: CookieService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.userType = this.cookie.get('userType');

    if (this.userType === 'subadmin') {
      const subadminId = this.cookie.get('subadminid');
      this.fetchSubAdminData(subadminId);
    }
  }

  private backend_URL = `${backendUrl}`;

  signOutAdmin() {
    const refreshToken = this.cookie.get('refreshToken');

    if (!refreshToken) {
      return;
    }

    this.http.post(`${this.backend_URL}adminlogout`, null, { responseType: 'text' }).subscribe({
      next: (response: string) => {
        console.log(response);
        if (response === 'Logout successful') {
          this.cookie.delete('accessToken');
          this.cookie.delete('refreshToken');
          this.cookie.delete('adminid');
          this.router.navigate(['/adminlogin']);
        } else {
          console.error('Logout failed:', response);
        }
      },
      error: (error) => {
        console.error('Logout error', error);
      }
    });
  }

  fetchSubAdminData(subadminId: string): void {
    this.http.get(`${this.backend_URL}subadmindetails/${subadminId}`).subscribe({
      next: (response: any) => {
        console.log('Subadmin data:', response);
        this.subadminDetails = response; // Assign response to subadminDetails property
      },
      error: (error) => {
        console.error('Error fetching subadmin data:', error);
      }
    });
  }
}
