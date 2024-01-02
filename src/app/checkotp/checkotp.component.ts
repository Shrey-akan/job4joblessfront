import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-checkotp',
  templateUrl: './checkotp.component.html',
  styleUrls: ['./checkotp.component.css']
})
export class CheckotpComponent implements OnInit, OnDestroy {
  otpForm!: FormGroup;
  otpExpired: boolean = false;
  otpTimerSubscription!: Subscription;
  timeLeft: number = 120; // 120 seconds for 2 minutes

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]]
    });
    this.startOTPTimer();
  }

  ngOnDestroy(): void {
    if (this.otpTimerSubscription) {
      this.otpTimerSubscription.unsubscribe();
    }
  }

  startOTPTimer() {
    this.timeLeft = 120;
    this.otpExpired = false;
    this.otpTimerSubscription = timer(1000, 1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.otpExpired = true;
        this.otpTimerSubscription.unsubscribe();
        this.snackBar.open('OTP expired. Please resend OTP.', 'Dismiss', {
          duration: 5000,
        });
      }
    });
  }

  verifyOTP(): void {
    if (this.otpExpired) {
      this.snackBar.open('OTP expired. Please resend OTP.', 'Dismiss', {
        duration: 5000,
      });
      return;
    }

    const otpValue = this.otpForm.get('otp')?.value;
    const emailValue = this.otpForm.get('email')?.value;
    const uid = this.activatedRoute.snapshot.paramMap.get('uid');

    this.http.post('https://otpservice.onrender.com/0auth/verifyOtp', { uid, otp: otpValue, email: emailValue })
      .subscribe({
        next: (payload: any) => {
          if (payload.otpValid && !payload.otpExpired) {
            this.updateUserificationStatus(emailValue);
          } else {
            this.otpExpired = true; 
            this.snackBar.open('OTP not valid or expired', 'Dismiss', {
              duration: 5000,
            });
          }
        },
        error: (err) => {
          console.error(`Error during OTP verification: ${err}`);
          this.snackBar.open('Error during OTP verification', 'Dismiss', {
            duration: 5000,
          });
        }
      });
  }

  updateUserificationStatus(userName: string): void {
    this.http.post('https://job4jobless.com:9001/verifyUser', { userName })
      .subscribe({
        next: () => {
          console.log("User verified successfully");
          this.router.navigate(['/login']);
          alert('Registration successful!');
        },
        error: (err) => {
          console.error(`Error updating user verification status: ${err}`);
        }
      });
  }

  resendOTP(): void {
    const uid = this.activatedRoute.snapshot.paramMap.get('uid');
    this.http.post('https://otpservice.onrender.com/0auth/resendOtp', { uid })
      .subscribe({
        next: (response: any) => {
          if (response.otpResent) {
            this.startOTPTimer();
            this.snackBar.open('OTP has been resent', 'Dismiss', {
              duration: 5000,
            });
          } else {
            this.snackBar.open('Failed to resend OTP', 'Dismiss', {
              duration: 5000,
            });
          }
        },
        error: () => {
          this.snackBar.open('Error resending OTP', 'Dismiss', {
            duration: 5000,
          });
        }
      });
  }
}
