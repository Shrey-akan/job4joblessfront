import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { HttpClient } from '@angular/common/http';
import * as intelInput from "intl-tel-input";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isHovered = false;
  countries: string[] = [];
  userregister!: FormGroup;
  formSubmitted: any;
  passwordVisible: boolean = false;
  data: any;
  loading: boolean = false; // Added loading flag
  successMessage: string | null = null; // Added success message
  showWarning: boolean = false; // Added warning flag
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
      companyuser: [''],
      websiteuser: [''],
      userphone: ['', [Validators.required, Validators.pattern(/^\d{10}$/), Validators.pattern(/^[0-9]*$/)]],
      usercountry: ['', Validators.required],
      userstate: ['', Validators.required],
      usercity: ['', Validators.required]
    });
    // let responce = this.b1.viewuserdetailservice();
    // responce.subscribe((data1: any)=>this.data=data1);

    // this.http.get<any[]>('https://restcountries.com/v3/all').subscribe((data) => {
    //   this.countries = data.map(country => country.name.common);
    // });
    this.http.get<any[]>('https://restcountries.com/v3/all').subscribe((data) => {
      this.countries = data.map(country => country.name.common).sort();
    });


  }

  loginWithGoogle() {
    this.userservice.loginWithGoogle()
      .then((userCredential) => {
        // User is successfully authenticated
        const user = userCredential.user;
        // console.log('Authenticated');
        // console.log('User Info:', user);
        const userName = user.email;
        const userFirstName = user.displayName;
        console.log(userName);
        console.log(userFirstName);
        if (user.email && user.displayName) {
          const username = user.email;
          const userFirstName = user.displayName;
          // console.log(userName);
          this.userservice.createOrGetUser(userName, userFirstName);
        }
        else {
          // console.error('User email is null. Handle this case as needed.');
        }
      })
      .catch((error: any) => {
        // console.error('Authentication Error:', error);
        // Handle authentication errors here
      });
  }

  userRegisteration(): void {
    if (this.userregister.valid) {
      console.log(this.userregister);
      this.http.post('https://job4jobless.com:9001/insertusermail', this.userregister.getRawValue()).subscribe(
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
    this.http.post('https://otpservice.onrender.com/0auth/generateOtp', { uid: payload.uid, email: payload.userName }).subscribe(
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
      // console.log(usersignin.value);
    } else {
      // console.log(usersignin.value);
      // console.log("Invalid login");
      alert("Invalid Details");
      // Optionally, show an error message to the user
    }
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}


