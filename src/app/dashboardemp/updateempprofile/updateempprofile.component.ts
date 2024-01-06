import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { UserService } from 'src/app/auth/user.service';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import * as intelInput from "intl-tel-input";
@Component({
  selector: 'app-updateempprofile',
  templateUrl: './updateempprofile.component.html',
  styleUrls: ['./updateempprofile.component.css']
})
export class UpdateempprofileComponent implements OnInit {
  employeeForm!: FormGroup;
  countries: string[]=[];
  empDetail: any;
  abc: any;
  empid!: string | null;
  constructor(
    private formBuilder: FormBuilder,
    private b1: UserService,
    private route:ActivatedRoute,
    private router:Router,
    public cookie:CookieService,
    private http:HttpClient
  ) { }
  empId: String = "0";
  ngOnInit() {
    const innputElement = document.getElementById("empphone");
if (innputElement) {
      intelInput(innputElement, {
        initialCountry: "In",
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.0/js/utils.js"
      })
    }

    this.empId = this.cookie.get('emp');

    // console.log(this.empId);
    // console.log('Employer ID from cookie:', this.empId);
    let response = this.b1.fetchemployer();
  
    response.subscribe((data1: any) => {
      // Debugging: Log the data received from the API
      // console.log('Data from API:', data1);
      const eeid=this.empId;
      // console.log(eeid);
      
      // Filter the data array to include only the user with the matching userID
      // this.data = data1.find((user: any) => user.uid === uuid);
      this.empDetail = data1.find((emp: any) => emp.empid == eeid);
      // console.log(this.empDetail);
      // Debugging: Log the filtered data
      // console.log("hello");
      // console.log('Filtered Data:', this.empDetail);
      this.abc = this.empDetail.empmailid;
      // console.log(this.abc);
    });


    // Initialize the form with default values or load existing employee data
    this.employeeForm = this.formBuilder.group({
      empid: this.empId,
      empfname: ['', Validators.required],
      emplname: ['', Validators.required],
      empcompany: ['', Validators.required],
     
      empphone: ['', Validators.required],
      empcountry: ['', Validators.required],
      empstate: ['', Validators.required],
      empcity: ['', Validators.required],
      descriptionemp: ['', Validators.required]
    });
   
    this.http.get<any[]>('https://restcountries.com/v3/all').subscribe((data) => {
      this.countries = data.map(country => country.name.common);
    });
    this.empid = this.route.snapshot.paramMap.get('empid');
    this.fetchUserDetailById();

  }
  fetchUserDetailById() {
    if (this.empid) {
      this.http.get(`https://job4jobless.com:9001/fetchempById/${this.empid}`)
        .subscribe({
          next: (response: any) => {
            // Assuming response has the job post data in the correct format
            this.employeeForm.patchValue(response);
            // Populate form with the job details received
          },
          error: (error: any) => {
            console.error('Error fetching job details', error);
            // Handle error
          }
        });
    }
  }
  updateEmployee() {
    if (this.employeeForm.valid) {
      // Extract updated employee data from the form
      const updatedEmployee = this.employeeForm.value;
      // console.log(updatedEmployee);
      this.b1.updateEmployee(updatedEmployee)
      .pipe(
        catchError((error) => {
          // Handle the error response here
          console.error('Error updating profile:', error);
          return throwError(error); // Re-throw the error
        })
      )
      .subscribe({
        next: (response) => {
          // Handle the success response here
          // console.log('Profile updated successfully:', response);
          alert("Profile updated successfully");
          this.router.navigate(['/dashboardemp/profilemep']);
        },
        complete: () => {
          // This block is optional and can be used for handling completion
        }
      });
  } else {
    console.error('Form is invalid. Cannot update profile.');
  }
  }

}
