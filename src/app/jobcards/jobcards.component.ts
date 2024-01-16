import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

interface Job {
  jobid: string;
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
  searchJobTitle: string = '';
  searchLocation: string = '';
  filteredJobs: Job[] = [];
  

  constructor(private router: Router, private b1: UserService) {}

  performSearch() {
    this.filterJobs();
    // Implement search logic if needed
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    // this.filterJobs(); 
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
    // this.userID = this.cookie.get('uid');
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
    job.isDescriptionVisible = !job.isDescriptionVisible;
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


// jobIdLikedStatusMap: { [key: string]: boolean } = {};

// toggleLikedStatus(jobId: string): void {
//   const uid = this.cookie.get('uid');
//   console.log(uid);
//   console.log(jobId);
  
//   this.b1.updateJobStatus(jobId, { uid }).subscribe(
//     (response: any) => {
//       console.log('Check the values', response);

//       if (response.status) {
//         console.log('Job status updated successfully.');
//         this.jobIdLikedStatusMap[jobId] = true;
//         this.filterJobs();
//       } else {
//         console.error('Job status update failed.');
//       }
//     },
//     (error) => {
//       console.error('Error updating job status:', error);
//     }
//   );
// }
}
