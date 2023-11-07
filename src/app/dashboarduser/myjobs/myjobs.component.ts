import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-myjobs',
  templateUrl: './myjobs.component.html',
  styleUrls: ['./myjobs.component.css']
})
export class MyjobsComponent implements OnInit{

  data:any
  userData1!: any;
  abc:any;
  user: any;
  showDetails = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
  constructor(public cookie:CookieService , private b1:UserService , private router:Router) {}

  userID: String = "0";
  ngOnInit(): void {
    // Check if the userID is correctly retrieved from the cookie
    this.userID = this.cookie.get('uid');
    console.log(this.userID);
    console.log('User ID from cookie:', this.userID);
  
    let response = this.b1.fetchuser();
  
    response.subscribe((data1: any) => {
      // Debugging: Log the data received from the API
      console.log('Data from API:', data1);
      const uuid=this.userID;
      console.log(uuid);
      
      // Filter the data array to include only the user with the matching userID
      // this.data = data1.find((user: any) => user.uid === uuid);
      this.userData1 = data1.find((user: any) => user.uid == uuid);
      console.log(this.userData1);
      // Debugging: Log the filtered data
      console.log("hello");
      console.log('Filtered Data:', this.userData1);
      this.abc = this.userData1.userName;
      console.log(this.abc);
      this.fetchApplyJob();
    });
  }
  fetchApplyJob() {
    let response = this.b1.fetchapplyform();

    response
      .subscribe((data1: any) => {
        this.data = data1.filter((apply: any) => apply.uid == this.userID);
        console.log('Filtered Data:', this.data);
      });
  }
  navigateTo(){
    this.router.navigate(['/dashboarduser']);
  }
}
