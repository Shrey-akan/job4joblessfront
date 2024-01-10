import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
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
}
@Component({
  selector: 'app-jobcardu',
  templateUrl: './jobcardu.component.html',
  styleUrls: ['./jobcardu.component.css']
})
export class JobcarduComponent implements OnInit {
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
  

  constructor(private router: Router, private b1: UserService) {}

  performSearch() {
    // Implement search logic if needed
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  ngOnInit(): void {
    let response = this.b1.fetchjobpost();
    response.subscribe((data1: any) => {
      this.data1 = data1;
      this.data = data1;
      this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
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

  navigateToSignUp() {
    this.router.navigate(['/register']);
  }


  getJobsForCurrentPage(): Job[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.data.slice(startIndex, endIndex);
  }
  // public job: Job = {
  //   jobtitle: "Software Developer",
  //   companyforthisjob: "Orage Technologies",
  //   numberofopening: "12",
  //   locationjob: "Noida, Uttar Pradesh",
  //   descriptiondata: ["meow", "sekiro"],
  //   jobtype: "Remote",
  //   schedulejob: "Day Shift",
  //   payjob: "25000 - 45000",
  // }
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
  
}
