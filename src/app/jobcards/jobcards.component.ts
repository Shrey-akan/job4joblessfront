import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  sendTime:Date;
  isDescriptionVisible: boolean;
}

@Component({
  selector: 'app-jobcards',
  templateUrl: './jobcards.component.html',
  styleUrls: ['./jobcards.component.css']
})

export class JobcardsComponent implements OnInit {

  liked: boolean = false;
  data1: any;
  companies = [
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
  searchJobTitle: string = '';
  searchLocation: string = '';
  filteredJobs: Job[] = [];


  constructor(private router: Router, private b1: UserService) {}

  performSearch() {
    this.filterJobs();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
  userID: String = '0';
  ngOnInit(): void {
    let response = this.b1.fetchjobpost();
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
      // Set the selected job details before navigating
      this.b1.setJobTitle(selectedJob.jobtitle);
      this.b1.setCompanyName(selectedJob.companyforthisjob);
      this.b1.setEmpId(selectedJob.empid);
      this.b1.setJobId(selectedJob.jobid);
      this.router.navigate(['/dashboarduser/questionpaper']);
    } else {
      this.router.navigate(['/login']);
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
    this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  formatDate(sendTime: Date): Date | null {
    if (!sendTime) return null;

    const date = new Date(sendTime);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        console.error('Invalid date format:', sendTime);
        return null;
    }

    // Extract only the date part
    const extractedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return extractedDate;
}

}
