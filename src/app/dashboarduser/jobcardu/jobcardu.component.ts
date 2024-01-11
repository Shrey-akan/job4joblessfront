import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CookieService } from 'ngx-cookie-service';
interface Job {
  jobid: string;
  jobtitle: string;
  companyforthisjob: string;
  numberofopening: string;
  locationjob: string;
  descriptiondata: string[];
  jobtype: string;
  schedulejob: string;
  payjob: string;
  payjobsup: string;
  empid: string;
  status:boolean;
  uid:string; 
}
@Component({
  selector: 'app-jobcardu',
  templateUrl: './jobcardu.component.html',
  styleUrls: ['./jobcardu.component.css']
})
export class JobcarduComponent implements OnInit {
  liked: boolean = false;
  data1: any;
  companies = [
    // ... existing companies data
  ];
  searchQuery: string = '';
  showFooter = true;
  showJobFeed = true;
  showJobSearches = false;
  selectedJob: Job | null = null;
  data: Job[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  totalPages!: number;
  searchJobTitle: string = ''; // Add this property for job title search
  searchLocation: string = ''; // Add this property for location search
  filteredJobs: Job[] = [];

  constructor(private router: Router, private b1: UserService , private cookie:CookieService) {}

  performSearch() {
    this.filterJobs();
    // Implement search logic if needed
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.filterJobs(); 
  }
  userID: String = '0';
  ngOnInit(): void {
    let response = this.b1.fetchjobpost();
    response.subscribe((data1: any) => {
      this.data1 = data1;
      this.totalPages = Math.ceil(this.data1.length / this.itemsPerPage);
      this.filterJobs(); // Initial filter when data is loaded
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
      // Set the selected job details before navigating
      this.b1.setJobTitle(selectedJob.jobtitle);
      this.b1.setCompanyName(selectedJob.companyforthisjob);
      this.b1.setEmpId(selectedJob.empid);
      this.b1.setJobId(selectedJob.jobid);
  
      // Navigate to the '/dashboarduser/questionpaper' route
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
        return titleMatch && locationMatch;
      });
    } else {
      this.filteredJobs = this.data1;
    }

    // Update total pages based on filtered data
    this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);

    // Reset current page to 1 when filtering
    this.currentPage = 1;
  }


jobIdLikedStatusMap: { [key: string]: boolean } = {};

toggleLikedStatus(jobId: string): void {
  const uid = this.cookie.get('uid');
  this.b1.updateJobStatus(jobId, {uid}).subscribe(
    (response: any) => {
      this.jobIdLikedStatusMap[jobId] = response.status;
    },
    (error) => {
      console.error('Error updating liked status:', error);
    }
  );
}
}
