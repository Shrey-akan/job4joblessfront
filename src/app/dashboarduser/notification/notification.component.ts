import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApplyJob } from 'src/app/apply-job';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

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
  isLoading!: boolean;
  toggleTableVisibility() {
    this.isTableVisible = !this.isTableVisible;
  }

  expandedUser: any | null = null;
  constructor(public cookie:CookieService , private b1:UserService , private router:Router,private elRef: ElementRef, private renderer: Renderer2) {}
  userID: string = "0";

  ngOnInit(): void {
    this.userID = this.cookie.get('uid');
    let response = this.b1.fetchuser();
    response.subscribe((data1: any) => {
      const uuid=this.userID;
      this.userData1 = data1.find((user: any) => user.uid == uuid);
      this.abc = this.userData1.userName;
      this.fetchJobapplieddetails(this.userID);
    });

  }


  refreshNotifications() {
    this.isLoading = true;

  }
  fetchJobapplieddetails(uid: string | null) {
    console.log(uid);
    let response: any = this.b1.fetchapplyformnotify(uid);
    console.log(response);
    response.subscribe((data1: any) => {
      console.log(this.data);
      this.data = data1.filter((applyjobf: any) => applyjobf.uid == this.userID);
      console.log(this.data);
      this.filteredData = this.data;
      console.log(this.filteredData);
    });
  }
  navigateTo(){
    this.router.navigate(['/dashboarduser']);
  }
  formatTimeAgo(date: Date | null): string {
    if (!date) {
      return 'No date available';
    }

    const now = new Date();
    const timeDifference = now.getTime() - date.getTime();
    
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return years === 1 ? 'a year ago' : `${years} years ago`;
    } else if (months > 0) {
      return months === 1 ? 'a month ago' : `${months} months ago`;
    } else if (days > 0) {
      return days === 1 ? 'a day ago' : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
    } else {
      return 'just now';
    }
  }

}
