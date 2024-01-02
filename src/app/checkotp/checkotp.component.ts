import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar for showing alerts

@Component({
  selector: 'app-checkotp',
  templateUrl: './checkotp.component.html',
  styleUrls: ['./checkotp.component.css']
})
export class CheckotpComponent implements OnInit {
  otpForm!: FormGroup;
  otp: string = '';
  otpExpired: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
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
            this.showSnackBar('OTP expired', 'Resend', 2000 * 60); // Show alert using MatSnackBar
            this.resendOTP();
          }
        } else {
          this.showSnackBar('OTP not valid', 'Dismiss', 5000); // Show alert using MatSnackBar
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
        this.router.navigate(['/login']);
        alert('Register successful!');
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
            this.showSnackBar('OTP expired', 'Resend', 5000);
          }
        } else {
          this.showSnackBar('OTP not valid', 'Dismiss', 5000);
        }
      },
      error: (err) => {
        console.error(`Some error occurred: ${err}`);
      }
    });
  }

  // Function to show alerts using MatSnackBar
  showSnackBar(message: string, action: string, duration: number): void {
    this.snackBar.open(message, action, {
      duration: duration,
    });
  }
}
