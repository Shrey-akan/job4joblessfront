import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-optverify',
  templateUrl: './optverify.component.html',
  styleUrls: ['./optverify.component.css']
})
export class OptverifyComponent implements OnInit {
  otpForm!: FormGroup;
  otp: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private b1: UserService
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['',  [Validators.required, Validators.pattern(/^\d{10}$/), Validators.pattern(/^[0-9]*$/)]],
      email: ['', Validators.email]
    });
  }

  verifyOTP(): void {
    const empid = this.activatedRoute.snapshot.paramMap.get('empid');
    const otpValue = this.otpForm.controls['otp'].value;
    const emailValue = this.otpForm.controls['email'].value;

    this.http.post('https://otpservice.onrender.com/0auth/verifyOtp', {
      uid: this.activatedRoute.snapshot.paramMap.get('empid'),
      otp: this.otpForm.controls['otp'].value,
      email: this.otpForm.controls['email'].value
    })
    .subscribe({
      next: (payload: any) => {
        if (payload.otpValid) {
          if (!payload.otpExpired) {
            this.updateEmployerVerificationStatus(emailValue);
          } else {
            console.error("OTP expired");
            alert("OTP expired. Please resend the OTP.");
          }
        } else {
          console.error("Incorrect OTP");
          alert("Incorrect OTP. Please enter the correct OTP.");
        }
      },
      error: (err) => {
        console.error(`Some error occurred: ${err}`);
      }
    });
  }

  updateEmployerVerificationStatus(empmailid: string): void {
    this.http.post('https://job4jobless.com:9001/verifyEmployer', { empmailid: empmailid })
      .subscribe({
        next: (response: any) => {
          // console.log("Employer verified successfully");
          // Navigate to the desired route (e.g., '/employer/empsign')
          this.router.navigate(['/employer/empsign']);
          alert('Register successful!');
        },
        error: (err) => {
          console.error(`Error updating employer verification status: ${err}`);
        }
      });
  }
}
