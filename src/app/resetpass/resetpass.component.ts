import { Component, OnInit } from '@angular/core';
import { UserService } from '../auth/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css']
})
export class ResetpassComponent implements OnInit{
  userName: string = '';
  user: any;
  errorMessage: string | undefined;
  showWarning: boolean = false;
  userForm!: FormGroup; // Define a FormGroup for your form

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
 
  }
  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]]
    });
  }


  checkUser() {
    if (this.userForm.valid) {
      console.log("checking the user name", this.userForm.value.userName); // Access the userName field from userForm.value
      this.userService.checkUser(this.userForm.value.userName).subscribe({
        next: (payload: any) => {
          this.user = payload.userName;
          this.errorMessage = undefined;
          console.log(payload);
          console.log(payload.uid);
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
    this.http.post('https://otpservice.onrender.com/0auth/generateOtp', { uid: payload.uid, email: payload.userName }).subscribe({
      next: (response: any) => {
        if (response.otpCreated) {
          console.log(response.otpCreated);
          this.router.navigate(['/checkotpuser', payload.uid]);
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
