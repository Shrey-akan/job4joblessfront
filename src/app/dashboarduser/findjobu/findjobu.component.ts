import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';

interface Job {
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
  selector: 'app-findjobu',
  templateUrl: './findjobu.component.html',
  styleUrls: ['./findjobu.component.css']
})
export class FindjobuComponent {
  searchJobTitle: string = ''; // Add this property for job title search
  searchLocation: string = ''; // Add this property for location search
  filteredJobs: Job[] = []; // Add this property for storing filtered jobs

  allJobTitles: string[] = [];
  allLocations: string[] = [];
  
  showJobFeed = true;
  showJobSearches = false;
  selectedJob: Job | null = null;
  data: Job[] = [];
  datajobs: any;
  userData1: any;
  abc: any;
  user: any;

  showContainer(containerId: string): void {
    this.showJobFeed = false;
    this.showJobSearches = false;

    if (containerId === 'jbfeed') {
      this.showJobFeed = true;
    } else if (containerId === 'showsearches') {
      this.showJobSearches = true;
    }
  }

  constructor(private router: Router, public cookie: CookieService, private b1: UserService) {}

  selectJob(data: Job): void {
    this.selectedJob = data;
    this.b1.setJobTitle(this.selectedJob.jobtitle);
    this.b1.setCompanyName(this.selectedJob.companyforthisjob);
    this.b1.setEmpId(this.selectedJob.empid);
    console.log('Setting EmpId:', this.selectedJob.empid);
  }

  userID: String = '0';
  ngOnInit(): void {
    let response = this.b1.fetchjobpost();
    response.subscribe((data1: any) => (this.data = data1));

    this.userID = this.cookie.get('uid');
    console.log(this.userID);
    console.log('User ID from cookie:', this.userID);

    let responseUser = this.b1.fetchuser();

    responseUser.subscribe((data1: any) => {
      // Debugging: Log the data received from the API
      console.log('Data from API:', data1);
      const uuid = this.userID;
      console.log(uuid);

      // Filter the data array to include only the user with the matching userID
      this.userData1 = data1.find((user: any) => user.uid == uuid);
      console.log(this.userData1);
      // Debugging: Log the filtered data
      console.log('hello');
      console.log('Filtered Data:', this.userData1);
      this.abc = this.userData1.userName;
      console.log(this.abc);
      this.fetchApplyJob();
      this.filterJobs();
    });
    this.allJobTitles = this.data.map((job) => job.jobtitle);
    this.allLocations = this.data.map((job) => job.locationjob);
  }

  fetchApplyJob() {
    let response = this.b1.fetchapplyform();

    response.subscribe((data1: any) => {
      this.datajobs = data1.filter((apply: any) => apply.jumail == this.abc);
      console.log('Filtered Data:', this.datajobs);
    });
  }

  navigateToSignIn() {
    // Replace 'sign-in' with the actual route name of your sign-in page
    this.router.navigate(['/dashboarduser/questionpaper']);
  }

  filterJobs(): void {
    if (this.searchJobTitle || this.searchLocation) {
      this.filteredJobs = this.data.filter((job) => {
        const titleMatch = !this.searchJobTitle || job.jobtitle.toLowerCase().includes(this.searchJobTitle.toLowerCase());
        const locationMatch = !this.searchLocation || job.locationjob.toLowerCase().includes(this.searchLocation.toLowerCase());
        return titleMatch && locationMatch;
      });
    } else {
      // If no search criteria entered, show all jobs
      this.filteredJobs = this.data;
    }
  }
  showJobTitleDropdown = false;
  showLocationDropdown = false;
  
  toggleJobTitleDropdown(): void {
    this.showJobTitleDropdown = !this.showJobTitleDropdown;
  }
  
  toggleLocationDropdown(): void {
    this.showLocationDropdown = !this.showLocationDropdown;
  }
  
  selectJobTitle(title: string): void {
    this.searchJobTitle = title;
    this.showJobTitleDropdown = false;
  }
  
  selectLocation(location: string): void {
    this.searchLocation = location;
    this.showLocationDropdown = false;
  }
                         
}
