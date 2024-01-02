import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-alljobs',
  templateUrl: './alljobs.component.html',
  styleUrls: ['./alljobs.component.css']
})
export class AlljobsComponent implements OnInit {
  data: any;
  empDetail: any;
  abc: any;

  constructor(public cookie: CookieService, private b1: UserService, private router: Router, private cdr: ChangeDetectorRef) { }


  empId: String = "0";

  ngOnInit(): void {
    this.empId = this.cookie.get('emp');

    // console.log(this.empId);
    // console.log('Employer ID from cookie:', this.empId);

    // Fetch employer details
    let response = this.b1.fetchemployer();
    response.subscribe((data1: any) => {
      // console.log('Data from API:', data1);
      const eeid = this.empId;
      // console.log(eeid);

      this.empDetail = data1.find((emp: any) => emp.empid == eeid);
      // console.log(this.empDetail);

      this.abc = this.empDetail.empid;
      // console.log(this.abc);

      // Now that we have the empmailid, fetch job post details
      this.fetchJobPostDetails();
    });
  }

  fetchJobPostDetails() {
    let response = this.b1.fetchjobpost();

    response.subscribe((data1: any) => {
      this.data = data1.filter((job: any) => job.empid == this.abc);

      // Initialize the showDetails property for each job
      this.data.forEach((job: any) => {
        job.showDetails = false;
      });

      // console.log('Filtered Data:', this.data);
    });
  }


  showMoreInfo(job: any): void {
    // Toggle the showDetails property to show/hide additional job details
    job.showDetails = !job.showDetails;
    // console.log('showDetails:', job.showDetails); 
    this.cdr.detectChanges(); // Trigger change detection to update the view
  }

  editJob(jobid: string) {
    this.router.navigate(['/dashboardemp/updatejob/', jobid]);
  }

  redirectToDashboardEmp() {
    this.router.navigate(['/dashboardemp']);
  }
}
