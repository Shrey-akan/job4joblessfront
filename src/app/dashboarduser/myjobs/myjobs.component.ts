import { Component, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { ApplyJob } from 'src/app/apply-job';
@Component({
  selector: 'app-myjobs',
  templateUrl: './myjobs.component.html',
  styleUrls: ['./myjobs.component.css']
})
export class MyjobsComponent implements OnInit{
  showFloatingGif = false;
  userData1!: any;
  abc:any;
  user: any;
  showDetails = false;
  jobTitleFilter: string = '';
  statusOptions: string[] = ['All', 'Selected', 'Rejected', 'Reviewed', 'Waiting'];
  selectedStatus: string = 'All';
  selectedOption: string = '';
  isOpen: boolean = false;
  options: string[] = ['Selected', 'Reviewed', 'Waiting', 'Rejected'];
  empDetail: any;

  logval: any;
  data: ApplyJob[] = [];
  filteredData: ApplyJob[] = [];
  public chatEmail: string = "";
  isTableVisible: boolean = false;
  exportedData: string = '';
  toggleTableVisibility() {
    this.isTableVisible = !this.isTableVisible;
  }

  expandedUser: any | null = null;
  constructor(public cookie:CookieService , private b1:UserService , private router:Router,private elRef: ElementRef, private renderer: Renderer2) {}

  userID: String = "0";
  ngOnInit(): void {
    this.userID = this.cookie.get('uid');
    let response = this.b1.fetchuser();
    response.subscribe((data1: any) => {
      const uuid=this.userID;
      this.userData1 = data1.find((user: any) => user.uid == uuid);
      this.abc = this.userData1.userName;
      this.fetchJobapplieddetails();
    });
  }
  fetchJobapplieddetails() {
    let response: any = this.b1.fetchapplyform();
    response.subscribe((data1: any) => {
      this.data = data1.filter((applyjobf: any) => applyjobf.uid == this.userID);
      this.filteredData = this.data;
    });
  }
  filterApplications(status: string) {
    this.selectedStatus = status;
    if (status === 'All') {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter((application: ApplyJob) => application.profileupdate === this.selectedStatus);
    }
  }
  filterByJobTitle() {
    if (!this.jobTitleFilter) {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter((application: ApplyJob) =>
        application.jutitle.toLowerCase().includes(this.jobTitleFilter.toLowerCase())
      );
    }
  }

  showMoreInfo(user: ApplyJob):void {
    this.expandedUser = this.expandedUser === user ? null : user;
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
  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    return header + '\n' + rows.join('\n');
  }
  navigateTo(){
    this.router.navigate(['/dashboarduser']);
  }
}
