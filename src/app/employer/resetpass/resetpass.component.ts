import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { backendUrl , OtpUrl } from 'src/app/constant';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css']
})
export class ResetpassComponent  implements OnInit{
  empmailid: string = '';
  user: any;
  errorMessage: string | undefined;
  showWarning: boolean = false;
  employerForm!: FormGroup; // Define a FormGroup for your form

  private backend_URL=`${backendUrl}`;
  private Otp_Url = `${OtpUrl}`

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
 
  }
  ngOnInit(): void {
    this.employerForm = this.formBuilder.group({
      empmailid: ['', [Validators.required, Validators.email,Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]]
    });
  }


  checkUser() {
    if (this.employerForm.valid) {
      // console.log("checking the user name", this.employerForm.value.empmailid);
      this.userService.checkEmployer(this.employerForm.value.empmailid).subscribe({
        next: (payload: any) => {
          this.user = payload.empmailid;
          this.errorMessage = undefined;
          // console.log(payload);
          // console.log(payload.empid);
          this.generateOtp(payload);
        },
        error: (err: any) => {
          console.error(err);
          this.user = undefined;
          alert(this.user);
          this.errorMessage = err.error;
        }
      });
    }
  }

  generateOtp(payload: any) {
    this.http.post(`${this.Otp_Url}generateOtp`, { uid: payload.empid, email: payload.empmailid }).subscribe({
      next: (response: any) => {
        if (response.otpCreated) {
          // console.log(response.otpCreated);
          this.router.navigate(['/employer/checkotpemployer', payload.empid]);
        }
        else {
          console.error("Otp not generated");
          alert("Otp not generated");
        }
      },
      error: (err: any) => {
        console.error(`Some error occurred: ${err}`);
        alert(err);
      }
    });
  }

}
