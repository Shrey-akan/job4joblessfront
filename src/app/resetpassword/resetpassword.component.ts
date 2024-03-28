import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { backendUrl } from '../constant';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  passwordResetForm: FormGroup; // Declare the property
  successMessage = '';
  errorMessage = '';
  passwordVisible: boolean = false;
  passwordsDoNotMatch: boolean = false;

  private backend_URL=`${backendUrl}`;


  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient) {
    this.passwordResetForm = this.formBuilder.group({
      userName: [''],
      newPassword: ['', [Validators.required, Validators.minLength(8),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/)
    ]],
      verifyPassword: ['', Validators.required],
    });
  }
  passwordPatternValidator(): any | string {
    return (control: { value: any; }) => {
      const password = control.value;
      const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

      if (!pattern.test(password)) {
        return { invalidPassword: true };
      }

      return null;
    };
  }
  ngOnInit(): void {
    // this.passwordResetForm = this.formBuilder.group({
    //   userName: [''],
    //   newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordPatternValidator()]],
    //   verifyPassword: ['', Validators.required],
    // });
  }



  submitForm() {
    if (this.passwordResetForm.valid) {
      const newPasswordControl = this.passwordResetForm.get('newPassword');
      const verifyPasswordControl = this.passwordResetForm.get('verifyPassword');

      if (newPasswordControl && verifyPasswordControl) {
        const newPassword = newPasswordControl.value;
        const verifyPassword = verifyPasswordControl.value;

        if (newPassword !== verifyPassword) {
          this.passwordsDoNotMatch = true;
          return;
        }

        this.passwordsDoNotMatch = false;


        const formData = this.passwordResetForm.value;

        // Make a POST request to your backend for password reset
        this.http.post(`${this.backend_URL}resetPasswordUser`, formData)
          .subscribe(
            {
              next: (response: any) => {
                // Handle success
                console.log(response);
                this.successMessage = 'Password updated successfully';
                this.errorMessage = '';
                alert('Password updated successfully');
                this.router.navigate(['/login']);
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



  }

}