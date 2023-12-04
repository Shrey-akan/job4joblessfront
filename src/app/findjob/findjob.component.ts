import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
}
@Component({
  selector: 'app-findjob',
  templateUrl: './findjob.component.html',
  styleUrls: ['./findjob.component.css'],
  animations: [
    trigger('fadeInOut', [
        state('in', style({ opacity: 1, transform: 'scale(1)' })),
        transition(':enter', [
            style({ opacity: 0, transform: 'scale(0.5)' }),
            animate('1s ease-in-out')
        ]),
    ]),
],
})
export class FindjobComponent implements OnInit{
  data1: any;
  companies = [
    {
      name: 'Air Arabia PJSC',
      logoUrl: 'https://static.naukimg.com/ni/nihome/logonbanner/220715_180x70.gif'
    },
    {
      name: 'MPH Technical Services',
      logoUrl: 'https://static.naukimg.com/ni/nihome/logonbanner/19769_180x70.gif'
    },
    {
      name: 'Air Products (Middle East) FZE',
      logoUrl: 'https://static.naukimg.com/ni/nihome/logonbanner/147435_180x70.gif'
    },
    {
      name: 'Air Products (Middle East) FZE',
      logoUrl: 'https://static.naukimg.com/ni/nihome/logonbanner/31713_180x70_v2.gif'
    },
    {
      name: 'Air Arabia PJSC',
      logoUrl: 'https://static.naukimg.com/ni/nihome/logonbanner/22384_180x70_v2.gif'
    },
    {
      name: 'MPH Technical Services',
      logoUrl: 'https://static.naukimg.com/ni/nihome/logonbanner/110506_180x70.gif'
    },
    {
      name: 'Air Products (Middle East) FZE',
      logoUrl: 'https://static.naukimg.com/ni/nihome/logonbanner/49790_180x70_v3.gif'
    },
    {
      name: 'Air Products (Middle East) FZE',
      logoUrl: 'https://static.naukimg.com/ni/nihome/logonbanner/31970_180x70_v2.gif'
    },
    // Add more company objects with name and logoUrl properties
  ];
  searchQuery: string = ''; // The search query input field value

  showFooter = true;
  showJobFeed = true;
  showJobSearches = false;
  selectedJob: Job | null = null;
  data: Job[] = [];
  itemsPerPage = 3; // Number of items to display per page
  currentPage = 1; // Current page number
  totalPages!: number; // Total number of pages
  images = [
    'assets/07-image.jpg',
    'assets/09-image.jpg',
    'assets/01image.jpg',
    // Add more image URLs as needed
  ];

  currentImageIndex = 0;
  showContainer(containerId: string): void {
    this.showJobFeed = false;
    this.showJobSearches = false;

    if (containerId === 'jbfeed') {
      this.showJobFeed = true;
    } else if (containerId === 'showsearches') {
      this.showJobSearches = true;
    }
  }

  constructor(private router: Router, private b1: UserService) {}

  selectJob(data: any): void {
    this.selectedJob = data;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  ngOnInit(): void {
    let response = this.b1.fetchjobpost();
    response.subscribe((data1: any) => {
      this.data1 = data1;
      this.data = data1; // Initialize data with all jobs initially
      this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
    });
    setInterval(() => this.nextImage(), 1000);
  }

  // Add a function to perform the search
  searchJobs() {
    // Filter the jobs based on the search query
    this.data = this.data1.filter((job: Job) => {
      const titleMatch = job.jobtitle.toLowerCase().includes(this.searchQuery.toLowerCase());
      const locationMatch = job.locationjob.toLowerCase().includes(this.searchQuery.toLowerCase());
      // Add more criteria for filtering if needed
      return titleMatch || locationMatch;
    });
  }

  navigateToSignIn() {
    // Replace 'sign-in' with the actual route name of your sign-in page
    this.router.navigate(['/login']);
  }

  showTrending = false;

  toggleTrending() {
    this.showTrending = !this.showTrending;
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }
  getJobsForCurrentPage(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.data.slice(startIndex, endIndex);
  }
  
}
