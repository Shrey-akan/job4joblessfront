import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { backendUrl } from 'src/app/constant';

@Component({
  selector: 'app-resetpasswordemployer',
  templateUrl: './resetpasswordemployer.component.html',
  styleUrls: ['./resetpasswordemployer.component.css']
})
export class ResetpasswordemployerComponent implements OnInit {
  passwordResetForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

  private backend_URL=`${backendUrl}`;

  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.passwordResetForm = this.formBuilder.group({
      empmailid: ['', [Validators.required, Validators.email]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        ],
      ],
      verifyPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const verifyPassword = control.get('verifyPassword')?.value;

    return newPassword === verifyPassword ? null : { passwordMismatch: true };
  }

  submitForm() {
    console.log(this.passwordResetForm);
    if (this.passwordResetForm.valid) {
      const formData = this.passwordResetForm.value;

      this.http.post(`${this.backend_URL}resetPasswordEmpverify`, formData)
        .subscribe({
          next: (response: any) => {
            this.successMessage = 'Password updated successfully';
            this.errorMessage = '';
            alert('Password updated successfully');
            this.router.navigate(['/employer/empsign']);
          },
          error: (err: any) => {
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
          },
        });
    } else {
   console.log("error occured");
    }
  }
}
