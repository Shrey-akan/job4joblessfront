import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { ApplyJob } from 'src/app/apply-job';

@Component({
  selector: 'app-applieduserdetails',
  templateUrl: './applieduserdetails.component.html',
  styleUrls: ['./applieduserdetails.component.css']
})
export class ApplieduserdetailsComponent implements OnInit {
  statusOptions: string[] = ['All', 'Selected', 'Rejected', 'Reviewed', 'Waiting'];
  selectedStatus: string = 'All';
  selectedOption: string = '';
  isOpen: boolean = false;
  options: string[] = ['Selected', 'Reviewed', 'Waiting', 'Rejected'];
  empDetail: any;
  abc: any;
  logval: any;
  data: ApplyJob[] = [];
  filteredData: ApplyJob[] = [];
  public chatEmail: string = "";
  isTableVisible: boolean = false;
  exportedData: string = '';
  jobTitleFilter: string = '';

  // Function to toggle the table visibility
  toggleTableVisibility() {
    this.isTableVisible = !this.isTableVisible;
  }

  // Define a property to keep track of the expanded user profile
  expandedUser: any | null = null;

  constructor(private router: Router, private formbuilder: FormBuilder, private b1: UserService, public cookie: CookieService) { }

  empId: String = "0";

  ngOnInit(): void {
    this.empId = this.cookie.get('emp');

    let response = this.b1.fetchemployer();
    response.subscribe((data1: any) => {
      // Filter the data array to include only the user with the matching userID
      this.empDetail = data1.find((emp: any) => emp.empid == this.empId);
      this.abc = this.empDetail.empId;
      this.fetchJobapplieddetails();
    });
  }

  // Fetch and filter job applications
  fetchJobapplieddetails() {
    let response: any = this.b1.fetchapplyform();
    response.subscribe((data1: any) => {
      this.data = data1.filter((applyjobf: any) => applyjobf.empid == this.empId);
      // Initially, display all applications
      this.filteredData = this.data;
    });
  }

  filterApplications(status: string) {
    this.selectedStatus = status;
    if (status === 'All') {
      this.filteredData = this.data; // Display all applications
    } else {
      this.filteredData = this.data.filter((application: ApplyJob) => application.profileupdate === this.selectedStatus);
    }
  }

  // Filter data by job title
  // filterByJobTitle() {
  //   if (!this.jobTitleFilter) {
  //     this.filteredData = this.data; // Display all applications when the filter is empty
  //   } else {
  //     this.filteredData = this.data.filter((application: ApplyJob) =>
  //       application.jutitle.toLowerCase().includes(this.jobTitleFilter.toLowerCase())
  //     );
  //   }
  // }
  filterByJobTitle() {
    if (!this.jobTitleFilter) {
      this.filteredData = this.data; // Display all applications when the filter is empty
    } else {
      this.filteredData = this.data.filter((application: ApplyJob) =>
        application.jutitle.toLowerCase().includes(this.jobTitleFilter.toLowerCase())
      );
    }
  }

  navigateToMessage(uid: string) {
    // Use the passed email as a parameter when navigating
    this.router.navigate(['/dashboardemp/empmessage/', uid]);
  }

  navigateToVideo(uid: string) {
    this.router.navigate(['/dashboardemp/videocall/', uid]);
  }

  // Define the showMoreInfo method
  showMoreInfo(user: any) {
    // Toggle the expandedUser property to show/hide additional information
    this.expandedUser = this.expandedUser === user ? null : user;
  }

  updateProfileUpdate(application: ApplyJob) {
    // Update the 'profileupdate' field of the selected 'application'
    application.profileupdate = this.selectedOption;

    // Make an HTTP request to update the 'profileupdate' field in the database
    this.b1.updateProfileUpdate(application).subscribe((updatedApplication: any) => {
      // Handle the response if needed
      // console.log('Profile updated:', updatedApplication);
    });
  }

  toggleDropdown(application: any) {
    application.isOpen = !application.isOpen;
  }

  selectOption(application: any, option: string) {
    this.selectedOption = option; // Update the selected option
    application.isOpen = false;
    // console.log('Selected option:', this.selectedOption); 
  }

  generateTablePDF() {
    const table = document.getElementById('dataTable');
    if (table) {
      const pdfWindow = window.open('', '_blank');
      if (pdfWindow) {
        pdfWindow.document.open();
        pdfWindow.document.write('<html><body>');
        pdfWindow.document.write('<table>' + table.innerHTML + '</table>');
        pdfWindow.document.write('</body></html>');
        pdfWindow.document.close();

        // Optionally, give it a moment to load and then print
        setTimeout(() => {
          pdfWindow.print();
        }, 500);
      } else {
        console.error('Failed to open a new window for the PDF.');
      }
    } else {
      console.error('Table element is not available.');
    }
  }

  // Function to convert data to CSV format
  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    return header + '\n' + rows.join('\n');
  }
}
