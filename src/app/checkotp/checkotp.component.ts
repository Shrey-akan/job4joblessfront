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
  remainingTime: number = 0;
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private b1: UserService
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', Validators.minLength(6)],
      email: ['', Validators.email]
    });
  }

  verifyOTP(): void {
    const uid = this.activatedRoute.snapshot.paramMap.get('uid');
    const otpValue = this.otpForm.controls['otp'].value;
    const emailValue = this.otpForm.controls['email'].value;

    this.http.post('https://otpservice.onrender.com/0auth/verifyOtp', {
      uid: uid,
      otp: otpValue,
      email: emailValue
    }).subscribe({
      next: (payload: any) => {
        if (payload.otpValid) {
          if (!payload.otpExpired) {
            this.updateUserificationStatus(emailValue);
          } else {
            this.otpExpired = true;
            this.startResendTimer();
            this.snackBar.open('OTP expired. Resending...', '', {
              duration: 5000
            });
            this.resendOTP();
          }
        } else {
          this.snackBar.open('OTP not valid', 'Dismiss', {
            duration: 5000
          });
        }
      },
      error: (err) => {
        console.error(`Some error occurred: ${err}`);
        this.snackBar.open('Error verifying OTP', 'Dismiss', {
          duration: 5000
        });
      }
    });
  }

  updateUserificationStatus(userName: string): void {
    this.http.post('https://job4jobless.com:9001/verifyUser', { userName: userName })
      .subscribe({
        next: () => {
          console.log("User verified successfully");
          this.router.navigate(['/login']);
          this.snackBar.open('Registration successful!', 'Dismiss', {
            duration: 5000
          });
        },
        error: (err) => {
          console.error(`Error updating user verification status: ${err}`);
          this.snackBar.open('Error updating user verification status', 'Dismiss', {
            duration: 5000
          });
        }
      });
  }

  resendOTP(): void {
    this.resendButtonDisabled = true;

    this.http.post('https://otpservice.onrender.com/0auth/resendOtp', { email: this.otpForm.controls['email'].value })
      .subscribe({
        next: (response: any) => {
          if (response.otpResent) {
            console.log('OTP resent successfully');
            this.snackBar.open('OTP resent successfully', 'Dismiss', {
              duration: 5000
            });
          } else {
            console.error('Error resending OTP');
            this.snackBar.open('Error resending OTP', 'Dismiss', {
              duration: 5000
            });
          }
          this.resetResendTimer();
        },
        error: (err) => {
          console.error(`Error resending OTP: ${err}`);
          this.resetResendTimer();
          this.snackBar.open('Error resending OTP', 'Dismiss', {
            duration: 5000
          });
        }
      });
  }

  private startResendTimer(): void {
    this.remainingTime = 120;
    const timerInterval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime === 0) {
        this.resendButtonDisabled = false;
        clearInterval(timerInterval);
      }
    }, 1000);
  }

  private resetResendTimer(): void {
    this.resendButtonDisabled = false;
    this.remainingTime = 0;
  }
}
