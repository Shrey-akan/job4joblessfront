import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constant';


@Component({
  selector: 'app-employerdetails',
  templateUrl: './employerdetails.component.html',
  styleUrls: ['./employerdetails.component.css']
})
export class EmployerdetailsComponent implements OnInit{
  
  data:any;
  private backend_URL = `${backendUrl}`;
  currentPage = 1;
  itemsPerPage = 10;

  loadNextPage() {
    this.currentPage++;
  }

  loadPreviousPage() {
    this.currentPage--;
  }


  constructor(private b1:UserService,private router:Router , private http: HttpClient){}
  
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

  toggleUserActivation(empid: string): void {
    this.http.put(`${this.backend_URL}empldeactivate/${empid}`, {}).subscribe({
      next: () => {
        console.log(`User account ${empid} ${this.getEmployeeById(empid).accempldeactivate ? 'activated' : 'deactivated'} successfully`);
        // Update the user's accdeactivate status in the UI
        this.getEmployeeById(empid).accempldeactivate = !this.getEmployeeById(empid).accempldeactivate;
      },
      error: (error) => {
        console.error(`Error toggling user activation status for user ${empid}:`, error);
        // Handle error scenarios
      }
    });
  }
  infoPage(jobid:string):void
  {
    this.router.navigate(['/infoPage']);
  }
  getEmployeeById(empid: string): any {
    return this.data.find((user: any) => user.empid === empid);
  }
  truncateDescription(description: string): string {
    if (!description) {
      return ''; // Return empty string if description is null or undefined
    }
  
    const words = description.split(' ');
    if (words.length > 50) {
      return words.slice(0, 30).join(' ') + '...';
    } else {
      return description;
    }
  }
  
}