import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar for showing alerts

@Component({
  selector: 'app-checkotpuser',
  templateUrl: './checkotpuser.component.html',
  styleUrls: ['./checkotpuser.component.css']
})
export class CheckotpuserComponent implements OnInit {
  otpForm!: FormGroup;
  otp: string = '';
  otpExpired: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private b1: UserService,
    private snackBar: MatSnackBar // Inject MatSnackBar
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
      uid: this.activatedRoute.snapshot.paramMap.get('uid'),
      otp: otpValue,
      email: emailValue
    })
    .subscribe({
      next: (payload: any) => {
        if (payload.otpValid) {
          if (!payload.otpExpired) {
            this.updateUserificationStatus(emailValue);
          } else {
            this.otpExpired = true;
            this.snackBar.open('OTP expired', 'Resend', {
              duration: 2000 * 60, // Display the message for 5 seconds
            });
            this.resendOTP();
          }
        } else {
          this.snackBar.open('Incorrect OTP', 'Dismiss', {
            duration: 5000, // Display the message for 5 seconds
          });
        }
      },
      error: (err) => {
        console.error(`Some error occurred: ${err}`);
      }
    });
  }

  updateUserificationStatus(userName: string): void {
    this.http.post('https://job4jobless.com:9001/verifyUser', { userName: userName })
    .subscribe({
      next: (response: any) => {
        console.log("User verified successfully");
        this.router.navigate(['/resetpassword']);
      },
      error: (err) => {
        console.error(`Error updating employer verification status: ${err}`);
      }
    });
  }

  resendOTP(): void {
    this.http.post('https://otpservice.onrender.com/0auth/verifyOtp', {
      uid: this.activatedRoute.snapshot.paramMap.get('uid'),
      otp: this.otpForm.controls['otp'].value,
      email: this.otpForm.controls['email'].value
    })
    .subscribe({
      next: (payload: any) => {
        if (payload.otpValid) {
          if (!payload.otpExpired) {
            this.router.navigate(['login']);
          } else {
            this.otpExpired = true;
            this.snackBar.open('OTP expired', 'Resend', {
              duration: 5000, // Display the message for 5 seconds
            });
          }
        } else {
          this.snackBar.open('Incorrect OTP', 'Dismiss', {
            duration: 5000, // Display the message for 5 seconds
          });
        }
      },
      error: (err) => {
        console.error(`Some error occurred: ${err}`);
      }
    });
  }
}
