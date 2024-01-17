import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import * as intelInput from "intl-tel-input";
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-empregister',
  templateUrl: './empregister.component.html',
  styleUrls: ['./empregister.component.css']
})
export class EmpregisterComponent {
  isHovered = false;
  countries: string[] = [];
  employerdetails: FormGroup;
  formSubmitted: any;
  empPasswordVisible: boolean = false;
  data1: any;
  successMessage: string | null = null;
  showWarning: boolean = false;
  htmlContent = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    toolbarPosition: 'top',
    outline: true,
    defaultFontName: 'Arial',
    defaultFontSize: '3',
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  loading: boolean = false; // Added loading flag
  constructor(private formBuilder: FormBuilder, private router: Router, private b1: UserService, private http: HttpClient) {
    this.employerdetails = this.formBuilder.group({
      empfname: ['', Validators.required],
      emplname: ['', Validators.required],
      empmailid: ['', [Validators.required, Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]],
      emppass: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      ]],
      empphone: ['', [Validators.required, Validators.pattern(/^\d{10}$/), Validators.pattern(/^[0-9]*$/)]],
      empcompany: [''],
      descriptionemp: [''],
      empcountry: ['', Validators.required],
      empstate: ['', Validators.required],
      empcity: ['', Validators.required]
    });



  }
  empRegisteration(): void {
    console.log(this.employerdetails);
    this.http.post('https://job4jobless.com:9001/insertEmployer', this.employerdetails.getRawValue()).subscribe({
      next: (payload: any) => {
        console.log("Checking after running the api", this.employerdetails);
        this.successMessage = 'Employer registered successfully! Please Wait...';
        this.generateOtp(payload);
      },
      error: (err) => {
        console.error(`Some error occurred: ${err}`);
      }
    });
  }

  loginWithGoogle() {
    this.b1.loginWithGoogle()
      .then((userCredential) => {
        // User is successfully authenticated
        const user = userCredential.user;
        console.log('Authenticated');
        console.log('User Info:', user);
        const empmailid = user.email;
        const empfname = user.displayName;
        // console.log(empmailid);
        if (user.email && user.displayName) {
          const empmailid = user.email;
          const empfname = user.displayName;
          // console.log(empmailid);
          this.b1.createOrGetEmployer(empmailid, empfname);
        }
        else {
          console.error('Employer email is null. Handle this case as needed.');
        }
      })
      .catch((error: any) => {
        console.error('Authentication Error:', error);
        // Handle authentication errors here
      });
  }


  generateOtp(payload: any) {
    this.http.post('https://otpservice.onrender.com/0auth/generateOtp', { uid: payload.empid, email: payload.empmailid }).subscribe({
      next: (response: any) => {
        if (response.otpCreated) {
          this.router.navigate(['/employer/optverify', payload.empid]);
        } else {
          console.error('Otp not generated');
        }
      },
      error: (err: any) => {
        console.error(`Some error occurred: ${err}`);
      }
    });
  }

  toggleEmpPasswordVisibility() {
    this.empPasswordVisible = !this.empPasswordVisible;
  }
  ngOnInit(): void {

    const innputElement = document.getElementById("empphone");
    if (innputElement) {
      intelInput(innputElement, {
        initialCountry: "In",
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.0/js/utils.js"
      })
    }

    // this.http.get<any[]>('https://restcountries.com/v3/all').subscribe((data) => {
    //   this.countries = data.map(country => country.name.common);
    // });
    this.http.get<any[]>('https://restcountries.com/v3/all').subscribe((data) => {
      this.countries = data.map(country => country.name.common).sort();
    });

  }

}
