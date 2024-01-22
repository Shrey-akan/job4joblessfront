import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';

declare var $: any;

@Component({
  selector: 'app-alljobs',
  templateUrl: './alljobs.component.html',
  styleUrls: ['./alljobs.component.css']
})
export class AlljobsComponent implements OnInit {
  data: any;
  empDetail: any;
  abc: any;
  selectedJob: any;

  constructor(
    public cookie: CookieService,
    private b1: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  empId: String = "0";

  ngOnInit(): void {
    this.empId = this.cookie.get('emp');
    this.fetchEmployerDetails();
  }

  fetchEmployerDetails() {
    let response = this.b1.fetchemployer();
    response.subscribe((data1: any) => {
      const eeid = this.empId;
      this.empDetail = data1.find((emp: any) => emp.empid == eeid);
      this.abc = this.empDetail.empid;
      this.fetchJobPostDetails();
    });
  }

  fetchJobPostDetails() {
    let response = this.b1.fetchjobpost();

    response.subscribe((data1: any) => {
      this.data = data1.filter((job: any) => job.empid == this.abc);
      this.data.forEach((job: any) => {
        job.showDetails = false;
      });
    });
  }

  showMoreInfo(job: any): void {
    job.showDetails = !job.showDetails;

    // if (job.showDetails) {
    //   this.fetchAppliedUsers(job.empid, job.jobid);
    // }

    this.cdr.detectChanges();
  }

  fetchAppliedUsers(empid: string, jobid: string) {
    let response = this.b1.fetchapplyformbyjobid(empid, jobid);
  
    response.subscribe(
      (users: any) => {
        this.selectedJob = { ...this.selectedJob, applicants: users };
        this.openModal();
      },
      (error: any) => { 
        console.error('Error fetching applied users:', error);
        // Handle error and show appropriate message
      }
    );
  }

  openModal() {
    $('.modal').modal('show');
  }

  closeModal() {
    $('.modal').modal('hide');
  }

  editJob(jobid: string) {
    this.router.navigate(['/dashboardemp/updatejob/', jobid]);
  }

  redirectToDashboardEmp() {
    this.router.navigate(['/dashboardemp']);
  }
  showAllApplicantsDetails(){
    this.router.navigate(['/dashboardemp/applieduserdetails'])
  }
}
