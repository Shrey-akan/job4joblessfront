import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';
import { AdminserviceService } from '../adminauth/adminservice.service';

@Component({
  selector: 'app-enquirydetails',
  templateUrl: './enquirydetails.component.html',
  styleUrls: ['./enquirydetails.component.css']
})
export class EnquirydetailsComponent implements OnInit{
  
  data:any;
  dcontacts: any[] = [];
  constructor(private b1:UserService , private adminauth:AdminserviceService) { }
  
  ngOnInit(): void {
    let responce = this.b1.fetchcontact();
    responce.subscribe((data1: any)=>this.data=data1);    
    this.fetchData();
  }
  fetchData() {
    this.adminauth.fetchContacts().subscribe(
      (data) => {
        this.dcontacts = data; // Assign the fetched data to the contacts array
        console.log("hello");
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  openContactOption(contactNumber: string) {
    // Check if the phone number is valid (you can add more validation)
    if (/^\d+$/.test(contactNumber)) {
      // Phone number contains only digits, so it's suitable for dialing
      window.location.href = 'tel:' + contactNumber; // Open the phone dialer
    } else if (contactNumber.startsWith('+')) {
      // If the phone number starts with '+', assume it's an international number and open WhatsApp
      window.location.href = 'https://api.whatsapp.com/send?phone=' + contactNumber;
    } else {
      // Handle other cases or show an error message
      console.error('Invalid contact number:', contactNumber);
    }
  }

}
