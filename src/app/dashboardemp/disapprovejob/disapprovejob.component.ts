import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { UserService } from 'src/app/auth/user.service';
export interface PostJob {
  jobid: string;
  empName:string;
  empEmail:string;
  jobtitle: string;
  companyforthisjob: string;
  numberofopening: number;
  locationjob: string;
  jobtype: string;
  schedulejob: string;
  payjob: number;
  payjobsup: number;
  descriptiondata: string;
  empid: string;
  sendTime: Date;
  uid: string;
  status: boolean;
  applicants:number;
}

@Component({
  selector: 'app-disapprovejob',
  templateUrl: './disapprovejob.component.html',
  styleUrls: ['./disapprovejob.component.css']
})
export class DisapprovejobComponent implements OnInit {
  data: any;
  empDetail: any;
  abc: any;
  selectedJob: any;
  empId: string = "0";
  jobTitleFilter: string = '';
  isTableVisible: boolean = false;
  filteredData: any[] = [];
  constructor(
    public cookie: CookieService,
    private b1: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}



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



  // fetchJobPostDetails() {
  //   this.b1.fetchjobpost(this.empId).subscribe((data1: any) => {
  //     this.data = data1.filter((job: any) => job.empid == this.abc);
  //     console.log("checking the data",this.data);
  //     this.filteredData = this.data.map((job: any) => ({ ...job, showDetails: false }));
  //     console.log(this.filteredData.values);
  //   });
  // }
  fetchJobPostDetails() {
    this.b1.fetchDisapprovejobpostadmin(this.empId).subscribe((data1: any) => {
      this.data = data1.filter((job: any) => job.empid == this.abc);
      console.log("checking the console",data1);
      // Sort the data by sendTime in descending order
      this.filteredData = this.data
        .map((job: any) => ({ ...job, showDetails: false }))
        .sort((a: PostJob, b: PostJob) => {
          const dateA = new Date(a.sendTime || 0);
          const dateB = new Date(b.sendTime || 0);
          return dateB.getTime() - dateA.getTime();
        });
      
      console.log(this.filteredData);
    });
  }
  filterByJobTitle() {
    if (!this.jobTitleFilter) {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter((application: PostJob) =>
        application.jobtitle.toLowerCase().includes(this.jobTitleFilter.toLowerCase())
      );
    }
  }
  showMoreInfo(job: any): void {
    job.showDetails = !job.showDetails;
    this.cdr.detectChanges();
  }

  fetchAppliedUsers(empid: string, jobid: string) {
    let response = this.b1.fetchapplyformbyjobid(empid, jobid);
  
    response.subscribe(
      (users: any) => {
        this.selectedJob = { ...this.selectedJob, applicants: users };
  
      },
      (error: any) => { 
        console.error('Error fetching applied users:', error);
        // Handle error and show appropriate message
      }
    );
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
  toggleTableVisibility() {
    this.isTableVisible = !this.isTableVisible;
  }
}

