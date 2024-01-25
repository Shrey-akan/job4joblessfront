import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';

interface Job {
  jobid: string;
  empEmail:string;
  jobtitle: string;
  companyforthisjob: string;
  numberofopening: number;
  locationjob: string;
  descriptiondata: string[];
  jobtype: string;
  schedulejob: string;
  payjob: number;
  payjobsup: number;
  empid: string;
  saveStatus:boolean;
  uid:string; 
  sendTime:Date;
  isDescriptionVisible: boolean;
}

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})
export class SalaryComponent implements OnInit {
  liked: boolean = false;
  data1: any;
  searchQuery: string = '';
  showFooter = true;
  showJobFeed = true;
  showJobSearches = false;
  selectedJob: Job | null = null;
  data: Job[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  totalPages!: number;
  searchJobTitle: string = '';
  searchLocation: string = '';
  filteredJobs: Job[] = [];
  private jobStatus: boolean = true;
  uid!: string;
  constructor(private router: Router, private b1: UserService , private cookie:CookieService) {}

  performSearch() {
    this.filterJobs();
  }

  onPageChange(page: number): void {
    this.currentPage = page;

  }
  userID: String = '0';
  ngOnInit(): void {
    this.uid = this.cookie.get('uid');
    let response = this.b1.fetchJobPostsWithStatus(this.uid);
    response.subscribe((data1: any) => {
      this.data1 = data1;
      this.data1.sort((a: Job, b: Job) => {
        const dateA = new Date(a.sendTime);
        const dateB = new Date(b.sendTime);
        return dateB.getTime() - dateA.getTime();
      });
      this.totalPages = Math.ceil(this.data1.length / this.itemsPerPage);
      this.filterJobs(); 
    });
    this.data1.forEach((job: Job) => {
      job.isDescriptionVisible = false;
    });
    this.userID = this.cookie.get('uid');
  }
  searchJobs() {
    this.data = this.data1.filter((job: Job) => {
      const titleMatch = job.jobtitle.toLowerCase().includes(this.searchQuery.toLowerCase());
      const locationMatch = job.locationjob.toLowerCase().includes(this.searchQuery.toLowerCase());
      return titleMatch || locationMatch;
    });
  }
  navigateToSignIn() {
    this.router.navigate(['/login']);
  }
  toggleDescriptionVisibility(job: Job): void {
    this.selectedJob = this.selectedJob === job ? null : job;
  }
  navigateToSignUp() {
    this.router.navigate(['/register']);
  }
  getJobsForCurrentPage(): Job[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredJobs.slice(startIndex, endIndex);
  }
  applyForJob(selectedJob: Job) {
    if (selectedJob) {  
      this.b1.setJobTitle(selectedJob.jobtitle);
      this.b1.setCompanyName(selectedJob.companyforthisjob);
      this.b1.setEmpId(selectedJob.empid);
      this.b1.setJobId(selectedJob.jobid);
      this.router.navigate(['/dashboarduser/questionpaper']);
    } else {
      console.error('No job selected.');
    }
  }
  filterJobs(): void {
    console.log(this.searchJobTitle, this.searchLocation);
    if (this.searchJobTitle || this.searchLocation) {
      this.filteredJobs = this.data1.filter((job: Job) => {
        const titleMatch = !this.searchJobTitle || job.jobtitle.toLowerCase().includes(this.searchJobTitle.toLowerCase());
        const locationMatch = !this.searchLocation || job.locationjob.toLowerCase().includes(this.searchLocation.toLowerCase());
        return titleMatch && locationMatch && job.saveStatus;
      });
    } else {
      this.filteredJobs = this.data1.filter((job:Job) => job.saveStatus); 
    }
    this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    this.currentPage = 1;
  }
jobIdLikedStatusMap: { [key: string]: boolean } = {};
toggleLikedStatus(jobid: string): void {
  const uid = this.cookie.get('uid');
  console.log(uid);
  console.log(jobid);
  this.b1.updateSavedJobStatus(jobid, uid).subscribe(
    (response: any) => {
      console.log('Check the values', response);
      if (response.saveStatus != null) {
        console.log('Job status updated successfully.');
        this.jobIdLikedStatusMap[jobid] = response.saveStatus;
        this.filterJobs();
      } else {
        console.error('Job status update failed.');
      }
    },
    (error) => {
      console.error('Error updating job status:', error);
    }
  );
}
//   searchJobTitle: string = '';
//   searchLocation: string = '';
//   filteredJobs: Job[] = [];

//   showJobFeed = false;
//   showJobSearches = false;
  
  
//   selectedJob: Job | null = null;
//   data: Job[] = [];
//   datajobs: any;
//   userData1: any;
//   abc: any;
//   user: any;

//   showContainer(containerId: string): void {
//     this.showJobFeed = false;
//     this.showJobSearches = false;

//     if (containerId === 'jbfeed') {
//       this.showJobFeed = true;
//     } else if (containerId === 'showsearches') {
//       this.showJobSearches = true;
//     }
//   }

//   constructor(private router: Router, public cookie: CookieService, private b1: UserService) {}

//   selectJob(data: Job): void {
//     this.selectedJob = data;
//     this.b1.setJobTitle(this.selectedJob.jobtitle);
//     this.b1.setCompanyName(this.selectedJob.companyforthisjob);
//     this.b1.setEmpId(this.selectedJob.empid);

//   }

//   userID: String = '0';
//   ngOnInit(): void {
 

//     let response = this.b1.fetchjobpost();
//     response.subscribe((data1: any) => (this.data = data1));

//     this.userID = this.cookie.get('user');

//     let responseUser = this.b1.fetchuser();

//     responseUser.subscribe((data1: any) => {

//       const uuid = this.userID;

//       this.userData1 = data1.find((user: any) => user.uid == uuid);
//       this.abc = this.userData1.userName;
//       this.fetchApplyJob();
//     });
//   }

//   fetchApplyJob() {
//     let response = this.b1.fetchapplyform();

//     response.subscribe((data1: any) => {
//       this.datajobs = data1.filter((apply: any) => apply.jumail == this.abc);
//     });
//   }

//   navigateToSignIn() {
//     this.router.navigate(['/dashboarduser/questionpaper']);
//   }

//   filterJobs(): void {
//     if (this.searchJobTitle || this.searchLocation) {
//       this.filteredJobs = this.data.filter((job) => {
//         const titleMatch = !this.searchJobTitle || job.jobtitle.toLowerCase().includes(this.searchJobTitle.toLowerCase());
//         const locationMatch = !this.searchLocation || job.locationjob.toLowerCase().includes(this.searchLocation.toLowerCase());
//         return titleMatch && locationMatch;
//       });
//     } else {
//       this.filteredJobs = this.data;
//     }
//   }

//   navigateToDashboardUser() {
//     this.router.navigate(['/dashboarduser']);
// }


}
