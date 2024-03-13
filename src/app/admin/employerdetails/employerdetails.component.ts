import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-employerdetails',
  templateUrl: './employerdetails.component.html',
  styleUrls: ['./employerdetails.component.css']
})
export class EmployerdetailsComponent implements OnInit{
  
  data:any;


  constructor(private b1:UserService,private router:Router){}
  
  ngOnInit(): void {
    let responce = this.b1.fetchemployer();
    responce.subscribe((data1: any)=>this.data=data1);  
    const moveLeftBtn = document.getElementById("moveLeft");
    const moveRightBtn = document.getElementById("moveRight");
    const table = document.querySelector(".table-responsive");

    moveLeftBtn?.addEventListener("click", () => {
      if (table) {
        table.scrollLeft -= 100; // Adjust as needed
      }
    });

    moveRightBtn?.addEventListener("click", () => {
      if (table) {
        table.scrollLeft += 100; // Adjust as needed
      }
    });  
  }
  sendNotificationemp(empId:string){
       // Navigate to the notification component with the user ID as a parameter
    this.router.navigate(['/admin/notify/', empId]);
  }
}