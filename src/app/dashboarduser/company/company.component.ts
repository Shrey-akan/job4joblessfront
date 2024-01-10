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

  constructor(private yourHttpService: UserService) {} // Replace with your actual service

  ngOnInit() {
    // Fetch jobpost data and store it in jobpostData
    this.yourHttpService.fetchjobpost().subscribe((data: any) => {
      this.jobpostData = data;
      // Initially, show all companies
      this.filteredCompanies = this.jobpostData;
    });
  }

  searchCompanies() {
    // Filter the data based on the search term
    this.filteredCompanies = this.jobpostData.filter((company) => {
      return (
        company.jobtitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.companyforthisjob.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }
  
}