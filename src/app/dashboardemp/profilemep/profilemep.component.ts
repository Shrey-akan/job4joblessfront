import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { backendUrl } from 'src/app/constant';

interface Employer {
  empid: Number;
  empfname: String;
  emplname: String;
  empcompany: String;
  empmailid: String;
  emppass: String;
  empphone: String;
  empcountry: String;
  empstate: String;
  empcity: String;
  descriptionemp: String;
}

@Component({
  selector: 'app-profilemep',
  templateUrl: './profilemep.component.html',
  styleUrls: ['./profilemep.component.css']
})
export class ProfilemepComponent implements OnInit {
  isOpen: boolean = false;
  active: number = 0;
  data: any
  empDetail!: Employer;
  abc: any;
  emp: any;
  passwordResetForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  constructor(public cookie: CookieService, private fb: FormBuilder, private b1: UserService, private router: Router, private http: HttpClient) { }

  empId: string = "0";
  private backend_URL = `${backendUrl}`;
  ngOnInit(): void {



    this.empId = this.cookie.get('emp');

    // console.log(this.empId);
    // console.log('Employer ID from cookie:', this.empId);
    let response = this.b1.fetchemployer();

    response.subscribe((data1: any) => {
      // Debugging: Log the data received from the API
      // console.log('Data from API:', data1);
      const eeid = this.empId;
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

    this.passwordResetForm = this.fb.group({
      empmailid: [this.abc, [Validators.required, Validators.email]],
      oldPassword: ['',       [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      newPassword: ['',       [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      verifyPassword: ['',       [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]]
    });
  }


  submitForm() {
    if (this.passwordResetForm.valid) {
      // console.log(this.abc);
      // Set empmailid field in formData to the value of abc
      this.passwordResetForm.patchValue({ empmailid: this.abc });

      const formData = this.passwordResetForm.value;
      // Make a POST request to your backend for password reset
      this.http.post(`${this.backend_URL}resetPasswordEmp`, formData)
        .subscribe(
          {
            next: (response: any) => {
              // Handle success
              // console.log(response);
              this.successMessage = 'Password updated successfully';
              this.errorMessage = '';
              alert('Password updated successfully');
              this.router.navigate(['/dashboardemp/profilemep'])
            },
            error: (err: any) => {
              // Handle errors
              if (err.status === 401) {
                this.errorMessage = 'Invalid old password';
                this.successMessage = '';
              } else if (err.status === 404) {
                this.errorMessage = 'Employer not found';
                this.successMessage = '';
              } else {
                this.errorMessage = 'An error occurred: ' + err.message;
                this.successMessage = '';
              }
            }
          }
        );
    } else {
      // Form is invalid, show error messages or perform desired actions
    }
  }

  // updateEmployee(employee: any) {
  //   // Implement the logic to update the employee (e.g., open a modal or navigate to an update page)
  //   console.log('Update employee:', employee);
  // }
  updateuserprofile() {
    this.router.navigate(['/dashboardemp/updateempprofile', this.empId]);
  }
  handleActive(id: number) {
    this.active = id;
  }

  handleToggle() {
    this.isOpen = !this.isOpen;
  }

  togglePasswordVisibility(inputId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }
  
  deleteAccountemp() {
    console.log(this.empId)
    // console.log(this.empId);
    // Use this.userID to pass the user's ID for deletion
    this.b1.deleteEmployer(this.empId).subscribe(
      {
        next: (response: any) => {
          console.log(response);
          if (response === true) {
            alert("Employer Deleted Successfully");
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          alert(err);
        }
      }
    );
  }
}