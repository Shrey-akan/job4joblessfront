import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApplyJob } from 'src/app/apply-job';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-notificationemp',
  templateUrl: './notificationemp.component.html',
  styleUrls: ['./notificationemp.component.css']
})
export class NotificationempComponent implements OnInit {
  notifications: any[] = [];
  empId: string = "0";
  isLoading: boolean = false;
  statusOptions: string[] = ['All', 'Selected', 'Rejected', 'Reviewed', 'Waiting'];
  selectedStatus: string = 'Waiting';
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
  constructor(private notificationService: UserService, public cookie: CookieService,private router:Router) {}

  ngOnInit(): void {
    this.empId = this.cookie.get('emp');
    let response = this.notificationService.fetchemployer();
    response.subscribe((data1: any) => {
      // Filter the data array to include only the user with the matching userID
      this.empDetail = data1.find((emp: any) => emp.empid == this.empId);
      this.abc = this.empDetail.empId;
      this.fetchJobapplieddetails();
    });
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.isLoading = true;
    this.notificationService.fetchnotify().subscribe({
      next: (response: any) => {
        this.notifications = response.filter((notification: any) => {
          return notification.notifyuid === this.empId;
        });
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching notifications:', err);
        this.isLoading = false;
      }
    });
  }

  refreshNotifications(): void {
    this.fetchNotifications();
  }

  fetchJobapplieddetails() {
    let response: any = this.notificationService.fetchapplyform();
    response.subscribe((data1: any) => {
      this.data = data1.filter((applyjobf: any) => applyjobf.empid == this.empId);
      // Initially, display all applications
      // this.filteredData = this.data;
      this.filteredData = this.data.filter((application: ApplyJob) => application.profileupdate === this.selectedStatus);
    });
  }

  // filterApplications(status: string) {
  //   this.selectedStatus = status;
  //   if (status === 'All') {
  //     this.filteredData = this.data; 
  //   } else {
  //     this.filteredData = this.data.filter((application: ApplyJob) => application.profileupdate === this.selectedStatus);
  //   }
  // }
  filterApplications(status: string) {
    this.selectedStatus = "Waiting";
    if (this.selectedStatus === 'Waiting') {
      this.filteredData = this.data.filter((application: ApplyJob) => application.profileupdate === this.selectedStatus);
    } else {
      this.filteredData = this.data.filter((application: ApplyJob) => {
        return status === 'Waiting' ? application.profileupdate === status : application.profileupdate === 'Waiting';
      });
    }
  }

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
    this.notificationService.updateProfileUpdate(application).subscribe((updatedApplication: any) => {
      this.fetchJobapplieddetails();
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
