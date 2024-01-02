import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../auth/user.service';

@Component({
  selector: 'app-checkotp',
  templateUrl: './checkotp.component.html',
  styleUrls: ['./checkotp.component.css']
})
export class CheckotpComponent implements OnInit {
  otpForm!: FormGroup;
  otpExpired: boolean = false;
  resendButtonDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', Validators.minLength(6)],
      email: ['', Validators.email]
    });
  }

  verifyOTP(): void {
    const uid = this.activatedRoute.snapshot.paramMap.get('uid');
    const otpValue = this.otpForm.get('otp')?.value;
    const emailValue = this.otpForm.get('email')?.value;

    this.http.post('https://otpservice.onrender.com/0auth/verifyOtp', { uid, otp: otpValue, email: emailValue })
      .subscribe({
        next: (payload: any) => {
          if (payload.otpValid) {
            if (!payload.otpExpired) {
              this.updateUserVerificationStatus(emailValue);
            } else {
              this.otpExpired = true;
              this.snackBar.open('OTP expired. Resending...', 'Resend', {
                duration: 5000,
              });
              this.resendOTP();
            }
          } else {
            this.snackBar.open('OTP not valid', 'Dismiss', {
              duration: 5000,
            });
          }
        },
        error: (err) => {
          console.error(`Some error occurred: ${err}`);
        }
      });
  }

  updateUserVerificationStatus(userName: string): void {
    this.http.post('https://job4jobless.com:9001/verifyUser', { userName })
      .subscribe({
        next: (response: any) => {
          console.log('User verified successfully');
          this.router.navigate(['/login']);
          this.snackBar.open('Verification successful!', 'Dismiss', {
            duration: 5000,
          });
        },
        error: (err) => {
          console.error(`Error updating user verification status: ${err}`);
        }
      });
  }

  resendOTP(): void {
    const uid = this.activatedRoute.snapshot.paramMap.get('uid');
    this.resendButtonDisabled = true; // Disable the Resend button during the API call
    this.http.post('https://otpservice.onrender.com/0auth/resendOtp', { uid })
      .subscribe({
        next: (payload: any) => {
          if (payload.otpResent) {
            this.snackBar.open('OTP resent successfully', 'Dismiss', {
              duration: 5000,
            });
          } else {
            this.snackBar.open('Failed to resend OTP', 'Dismiss', {
              duration: 5000,
            });
          }
        },
        error: (err) => {
          console.error(`Some error occurred: ${err}`);
        },
        complete: () => {
          this.resendButtonDisabled = false; // Enable the Resend button after the API call is complete
        }
      });
  }
}
