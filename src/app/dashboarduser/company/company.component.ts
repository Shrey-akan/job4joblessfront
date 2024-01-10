import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';

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
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  jobpostData: any[] = []; // Variable to store jobpost data
  searchTerm: string = ''; // Property to store the search term
  filteredCompanies: any[] = []; // Declare filteredCompanies as an empty array
  itemsPerPage = 6;
  currentPage = 1;
  totalPages!: number;
  constructor(private yourHttpService: UserService) {} // Replace with your actual service

  // ngOnInit() {

  //   this.yourHttpService.fetchjobpost().subscribe((data: any) => {
  //     this.jobpostData = data;

  //     this.filteredCompanies = this.jobpostData;
  //   });
    
  // }

  // searchCompanies() {

  //   this.filteredCompanies = this.jobpostData.filter((company) => {
  //     return (
  //       company.jobtitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //       company.companyforthisjob.toLowerCase().includes(this.searchTerm.toLowerCase())
  //     );
  //   });
  // }
  ngOnInit() {
    this.yourHttpService.fetchjobpost().subscribe((data: any) => {
      this.jobpostData = data;
      this.totalPages = Math.ceil(this.jobpostData.length / this.itemsPerPage);
      this.filterCompanies();
    });
  }

  searchCompanies() {
    this.filterCompanies();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.filterCompanies();
  }

  filterCompanies(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredCompanies = this.jobpostData.slice(startIndex, endIndex);
  }
}