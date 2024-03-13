import { Component, OnInit , NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { HttpClient } from '@angular/common/http';
import * as intelInput from "intl-tel-input";
import { backendUrl , OtpUrl} from '../constant';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})


export class RegisterComponent implements OnInit {
  private backend_URL=`${backendUrl}`;
  private Otp_URL=`${OtpUrl}`;
  
  isHovered = false;
  countries: string[] = [];
  userregister!: FormGroup;
  formSubmitted: any;
  passwordVisible: boolean = false;
  data: any;
  loading: boolean = false;
  successMessage: string | null = null;
  showWarning: boolean = false;

  showGitInputBox: boolean = false;
  showLinkedInputBox: boolean = false;
  showOtherInputBox: boolean = false;

  toggleGitInputBox(event: any) {
    this.showGitInputBox = event.target.checked;
  }

  toggleLinkedInputBox(event: any) {
    this.showLinkedInputBox = event.target.checked;
  }

  toggleOtherInputBox(event: any) {
    this.showOtherInputBox = event.target.checked;
  }

  constructor(private formBuilder: FormBuilder, private router: Router, private userservice: UserService, private http: HttpClient) {
  }
  ngOnInit(): void {
    const innputElement = document.getElementById("phone");
    if (innputElement) {
      intelInput(innputElement, {
        initialCountry: "In",
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.0/js/utils.js"
      })
    }
    this.userregister = this.formBuilder.group({
      userFirstName: ['', Validators.required],
      userLastName: ['', Validators.required],
      userName: ['', [Validators.required, Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]],
      userPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ]
      ],
      userphone: ['', [Validators.required, Validators.pattern(/^\d{10}$/), Validators.pattern(/^[0-9]*$/)]],
      usercountry: ['', Validators.required],
      userstate: ['', Validators.required],
      usercity: ['', Validators.required],
      summary: ['', Validators.required],
      userlinkden: ['', Validators.required],
      usergithub: ['', Validators.required],
      otherturluser:['']
    });
    this.http.get<any[]>('https://restcountries.com/v3/all').subscribe((data) => {
      this.countries = data.map(country => country.name.common).sort();
    });
  }
  loginWithGoogle() {
    this.userservice.loginWithGoogle()
      .then((userCredential) => {
        const user = userCredential.user;
        const userName = user.email;
        const userFirstName = user.displayName;
        console.log(userName);
        console.log(userFirstName);
        if (user.email && user.displayName) {
          const username = user.email;
          const userFirstName = user.displayName;
          this.userservice.createOrGetUser(userName, userFirstName);
        }
        else {
        }
      })
      .catch((error: any) => {
      });
  }
  userRegisteration(): void {
    if (this.userregister.valid) {
      console.log(this.userregister);
      this.http.post(`${this.backend_URL}insertusermail`, this.userregister.getRawValue()).subscribe(
        (payload: any) => {
          console.log("checking after running api", this.userregister);
          this.successMessage = 'User registered successfully! Please Wait..';
          this.generateOtp(payload);
        },
        (err) => {
          console.error('Some error occurred:', err);
        }
      );
    } else {
      this.userregister.markAllAsTouched();
    }
  }
  generateOtp(payload: any) {
    this.http.post(`${this.Otp_URL}generateOtp`, { uid: payload.uid, email: payload.userName }).subscribe(
      (response: any) => {
        if (response.otpCreated) {
          this.router.navigate(['/checkotp', payload.uid]);
        } else {
          console.error('Otp not generated');
          alert('Otp not generated');
        }
      },
      (err) => {
        console.error('Some error occurred:', err);
        alert(err);
      }
    );
  }
  login(usersignin: { value: any; }) {
    const empemail = usersignin.value.userNamec;
    const emppassword = usersignin.value.passuserc;
    const empmatch = this.data.find((data1: any) => data1.userName === empemail && data1.passuser === emppassword);
    if (empmatch) {
      this.router.navigate(['/seeker/']);
    } else {
      alert("Invalid Details");
    }
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}