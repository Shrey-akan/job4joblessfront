import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkotp',
  templateUrl: './checkotp.component.html',
  styleUrls: ['./checkotp.component.css']
})
export class CheckotpComponent implements OnInit {
  otpForm!: FormGroup;
  otpExpired: boolean = false;

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

  verifyAndResendOTP(): void {
    const uid = this.activatedRoute.snapshot.paramMap.get('uid');
    const otpValue = this.otpForm.controls['otp'].value;
    const emailValue = this.otpForm.controls['email'].value;

    this.http
      .post('https://otpservice.onrender.com/0auth/verifyOtp', {
        uid: uid,
        otp: otpValue,
        email: emailValue
      })
      .subscribe({
        next: (payload: any) => {
          if (payload.otpValid) {
            if (!payload.otpExpired) {
              this.updateUserVerificationStatus(emailValue);
            } else {
              this.handleExpiredOTP();
            }
          } else {
            this.handleInvalidOTP();
          }
        },
        error: (err) => {
          console.error(`Some error occurred: ${err}`);
        }
      });
  }

  updateUserVerificationStatus(userName: string): void {
    this.http
      .post('https://job4jobless.com:9001/verifyUser', { userName: userName })
      .subscribe({
        next: (response: any) => {
          console.log('User verified successfully');
          this.router.navigate(['/login']);
          this.showAlert('Register successful!');
        },
        error: (err) => {
          console.error(`Error updating user verification status: ${err}`);
        }
      });
  }

  resendOTP(): void {
    this.http
      .post('https://otpservice.onrender.com/0auth/resendOtp', {
        uid: this.activatedRoute.snapshot.paramMap.get('uid'),
        email: this.otpForm.controls['email'].value
      })
      .subscribe({
        next: (payload: any) => {
          if (!payload.otpExpired) {
            this.router.navigate(['login']);
          } else {
            this.handleExpiredOTP();
          }
        },
        error: (err) => {
          console.error(`Some error occurred: ${err}`);
        }
      });
  }

  handleInvalidOTP(): void {
    this.showAlert('Invalid OTP. Please try again.');
  }

  handleExpiredOTP(): void {
    this.otpExpired = true;
    this.showAlert('OTP expired', 'Resend', 5000);
  }

  showAlert(message: string, action?: string, duration?: number): void {
    this.snackBar.open(message, action || 'Dismiss', {
      duration: duration || 5000
    });
  }
}
