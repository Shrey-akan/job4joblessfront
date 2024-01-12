import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resetpasswordemployer',
  templateUrl: './resetpasswordemployer.component.html',
  styleUrls: ['./resetpasswordemployer.component.css']
})
export class ResetpasswordemployerComponent implements OnInit{
  passwordResetForm!: FormGroup;
  successMessage = '';
  errorMessage = '';


  constructor(private formBuilder:FormBuilder,private router:Router,private http:HttpClient){}
  ngOnInit(): void {
    this.passwordResetForm = this.formBuilder.group({
      empmailid: ['', [Validators.required, Validators.email]],
    
      newPassword: ['',       [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      verifyPassword: ['', [Validators.required]]
    });
  }



  submitForm() {
    if (this.passwordResetForm.valid) {
      const formData = this.passwordResetForm.value;
      console.log(formData);
      this.http.post('https://job4jobless.com:9001/resetPasswordEmpverify', formData)
        .subscribe(
          {
            next: (response: any) => {
              console.log(formData);
              // Handle success
              console.log(response);                                  
              this.successMessage = 'Password updated successfully';
              this.errorMessage = '';
              alert('Password updated successfully');
              this.router.navigate(['/employer/empsign'])
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

}
