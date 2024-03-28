import { HttpClient } from '@angular/common/http';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { backendUrl } from 'src/app/constant';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
interface User {
  uid: Number;
  userName: String;
  userFirstName: String;
  userLastName: String;
  userPassword: String;
  companyuser: String;
  websiteuser: String;
  userphone: String;
  usercountry: String;
  userstate: String;
  usercity: String;
  summary: String;
}
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  data: any
  userData1!: User;
  public pdfUrl: string = '';
  abc: any;
  user: any;
  isOpen: boolean = false;
  active: number = 0;
  passwordResetForm!: FormGroup;


  successMessage = '';
  errorMessage = '';
  constructor(public cookie: CookieService,private sanitizer: DomSanitizer, private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private b1: UserService) { }

  userID: string = "0"; // Change 'String' to 'string'

  private backend_URL = `${backendUrl}`;

  ngOnInit(): void {
    // Check if the userID is correctly retrieved from the cookie
    this.userID = this.cookie.get('uid');
    // console.log(this.userID);
    // console.log('User ID from cookie:', this.userID);

    let response = this.b1.fetchuser();

    response.subscribe((data1: any) => {
      // Debugging: Log the data received from the API
      // console.log('Data from API:', data1);
      const uuid = this.userID;
      // console.log(uuid);

      // Filter the data array to include only the user with the matching userID
      // this.data = data1.find((user: any) => user.uid === uuid);
      this.userData1 = data1.find((user: any) => user.uid == uuid);
      // console.log(this.userData1);
      // Debugging: Log the filtered data
      // console.log("hello");
      // console.log('Filtered Data:', this.userData1);
      this.abc = this.userData1.userName;
      // console.log(this.abc);
    });

    this.passwordResetForm = this.formBuilder.group({
      userName: ['', Validators.required],
      oldPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      verifyPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
    });

  //   document.addEventListener("DOMContentLoaded", function() {
  //     var userDataSummary = document.getElementById("userDataSummary");
  //     if (userDataSummary !== null) {
  //         userDataSummary.innerHTML = User.summary;
  //     } else {
  //         console.error("Element with ID 'userDataSummary' not found.");
  //     }
  // });
  
    this.pdfUrl = `${this.backend_URL}getPdfByUi/${this.userID}`;
    // console.log('PDF URL:', this.pdfUrl);

  }

  submitForm() {
    if (this.passwordResetForm.valid) {
      // Set userName field in formData to the value of abc
      this.passwordResetForm.patchValue({ userName: this.abc });

      const formData = this.passwordResetForm.value;

      // Make a POST request to your backend for password reset
      this.http.post(`${this.backend_URL}resetPassword`, formData)
        .subscribe(
          {
            next: (response: any) => {
              // Handle success
              // console.log(response);
              this.successMessage = 'Password updated successfully';
              this.errorMessage = '';
              alert('Password updated successfully');
              this.router.navigate(['/dashboarduser/userprofile']);
            },

            error: (err: any) => {
              // Handle errors
              if (err.status === 401) {
                this.errorMessage = 'Invalid old password';
                this.successMessage = '';
              } else if (err.status === 404) {
                this.errorMessage = 'User not found';
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
  parseHTML(htmlString: string | undefined): SafeHtml {
    if (htmlString) {
      // Ensure that htmlString contains valid HTML markup
      const sanitizedHtml = this.sanitizer.sanitize(
        SecurityContext.HTML,
        htmlString
      );
      // Return sanitized HTML
      return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml || '');
    } else {
      return ''; // Return empty string as fallback
    }
  }
  userData: any = {

  };

  openUpdateProfileForm() {
    this.router.navigate(['/dashboarduser/updateprofile', this.userID]);
  }
  deleteAccount() {
    // console.log(this.userID);
    // Use this.userID to pass the user's ID for deletion
    this.b1.deleteUser(this.userID).subscribe(
      {
        next: (response: any) => {
          if (response === true) {
            alert("User Deleted Successfully");
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          alert(err);
        }
      }
    );
  }

  handleActive(id: number) {
    this.active = id;
  }

  handleToggle() {
    this.isOpen = !this.isOpen;
  }
}