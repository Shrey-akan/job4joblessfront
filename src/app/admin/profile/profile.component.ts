import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { AdminserviceService } from '../adminauth/adminservice.service';
interface Admin {

  adminId: String;
  adminName: String;
  adminMail: String;
  adminPass: String;
  
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  adminData: any = {}; 

  isOpen: boolean = false;
  active: number = 0;
  data: any;
  constructor(public cookie: CookieService, private router: Router, private adminauth: AdminserviceService) { }

  ngOnInit(): void {
   

    this.fetchAdminData();

   
  }
  fetchAdminData() {
    let responce = this.adminauth.fetchAdminData();
    // Make an HTTP request to fetch admin data
    responce.subscribe((data1: any)=>this.data=data1);   
  //   this.adminauth.fetchAdminData().subscribe(
  //  {
  //   next : (response:any ) =>{
  //     console.log(response);
  //       console.log('Admin Data:', response.adminName);
  //     this.adminData = response;
  //   },
  //   error: (err) => {
  //     // Handle errors
  //     console.error('Error:', err);
  //   }
  //  }
  //   );
  }
  


  handleActive(id: number) {
    this.active = id;
  }

  handleToggle() {
    this.isOpen = !this.isOpen;
  }

}
