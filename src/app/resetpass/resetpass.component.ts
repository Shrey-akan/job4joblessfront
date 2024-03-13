import { Component, OnInit } from '@angular/core';
import { UserService } from '../auth/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { backendUrl , OtpUrl} from '../constant';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css']
})
export class ResetpassComponent implements OnInit{
  private backend_URL=`${backendUrl}`;
  private Otp_Url = `${OtpUrl}`
  
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
      userName: ['', [Validators.required, Validators.email]]
    });
  }


  checkUser() {
    console.log("checking the user details ", this.userForm);
    if (this.userForm.valid) {
      console.log("checking the user name", this.userForm.value.userName); 
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
    console.log("checking the payload",payload);
    this.http.post(`${this.Otp_Url}`, { uid: payload.uid, email: payload.userName }).subscribe({
      next: (response: any) => {
        console.log("checking the response",response);
        if (response.otpCreated) {
          console.log(response.otpCreated);
          console.log(payload.uid);
          const uidid = payload.uid;
          console.log(uidid);
          
     if(payload.uid !== null){
      console.log("checking router is working");
      this.router.navigate(['/checkotpuser', payload.uid]);
     }
     else{
      console.log("checking router is not working");
     }

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
