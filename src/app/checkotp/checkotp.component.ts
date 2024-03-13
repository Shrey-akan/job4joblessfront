import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { backendUrl } from '../constant';

@Component({
  selector: 'app-checkotp',
  templateUrl: './checkotp.component.html',
  styleUrls: ['./checkotp.component.css']
})
export class CheckotpComponent implements OnInit {
  otpForm!: FormGroup;
  otp: string = '';
  otpExpired: boolean = false;
  private backend_URL = `${backendUrl}`

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['',  [Validators.required, Validators.pattern(/^\d{6}$/), Validators.pattern(/^[0-9]*$/)]],
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
            alert('OTP expired. Resend OTP.'); // Show alert using standard alert
            this.resendOTP();
          }
        } else {
          this.showAlert('OTP not matched. Please enter the correct OTP.');
        }
      },
      error: (err) => {
        console.error(`Some error occurred: ${err}`);
      }
    });
  }

  updateUserificationStatus(userName: string): void {
    this.http.post(`${this.backend_URL}verifyUser`, { userName: userName })
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
            alert('OTP expired. Resend OTP.'); // Show alert using standard alert
          }
        } else {
          this.showAlert('OTP not matched. Please enter the correct OTP.');
        }
      },
      error: (err) => {
        console.error(`Some error occurred: ${err}`);
      }
    });
  }

  // Function to show alerts using standard alert
  showAlert(message: string): void {
    alert(message);
  }
}
