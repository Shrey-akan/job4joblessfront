import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import * as intelInput from "intl-tel-input";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { backendUrl , OtpUrl} from 'src/app/constant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-empregister',
  templateUrl: './empregister.component.html',
  styleUrls: ['./empregister.component.css']
})
export class EmpregisterComponent implements OnInit {
  private backend_URL = `${backendUrl}`;
  private Otp_Url = `${OtpUrl}`;

  showWebsiteInputBox: boolean = false;
  showLinkedInputBox: boolean = false;
  showOtherInputBox: boolean = false;

  toggleWebsiteInputBox(event: any) {
    this.showWebsiteInputBox = event.target.checked;
  }

  toggleLinkedInputBox(event: any) {
    this.showLinkedInputBox = event.target.checked;
  }

  toggleOtherInputBox(event: any) {
    this.showOtherInputBox = event.target.checked;
  }

  isHovered = false;
  countries: string[] = [];
  employerdetails!: FormGroup;
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
  constructor(private formBuilder: FormBuilder, private router: Router, private b1: UserService, private http: HttpClient,
    private snackBar: MatSnackBar, private dialog: MatDialog) {
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
    this.employerdetails = this.formBuilder.group({
      empfname: ['', Validators.required],
      emplname: ['', Validators.required],
      empmailid: ['', [Validators.required, Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]],
      emppass: ['',[Validators.required , Validators.minLength(8) , Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@])[A-Za-z\d@]{8,}$/)]],
      empphone: ['', [Validators.required, Validators.pattern(/^\d{10}$/), Validators.pattern(/^[0-9]*$/)]],
      empcompany: ['', Validators.required],
      descriptionemp: ['', Validators.required],
      empcountry: ['', Validators.required],
      empstate: ['', Validators.required],
      empcity: ['', Validators.required],
      emplinkden: [''],
      designation: ['', Validators.required],
      websiteUrl: [''],
      empotherurl: ['']
    });
    this.http.get<any[]>('https://restcountries.com/v3/all').subscribe((data) => {
      this.countries = data.map(country => country.name.common).sort();
    });
  }

  empRegisteration(): void {
    if (this.employerdetails.valid) {
      console.log(this.employerdetails);
      this.http.post(`${this.backend_URL}insertEmployer`, this.employerdetails.getRawValue()).subscribe(
        (payload: any) => {
          console.log("checking after running api", this.employerdetails);
          this.successMessage = 'User registered successfully! Please Wait..';
          this.generateOtp(payload);
        },
        (err) => {
          if (err.status === 409) {
            this.snackBar.open('User with this Email Id already exist....', 'Close');
          }
          else if (err.status === 400) {
            this.snackBar.open('Please fill all the fields...', 'Close');
          }
          else {
            this.snackBar.open('Some error occured', 'Close');
          }
          console.error('Some error occurred: ', err);
        }
      );
    } else {
      this.employerdetails.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    const passwordInput: HTMLInputElement | null = document.getElementById("password-input") as HTMLInputElement;
    const eyeIcon: HTMLElement | null = document.getElementById("eye-icon");
  
    if (passwordInput && eyeIcon) {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
      } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
      }
    }
  }

  loginWithGoogle() {
    this.b1.loginWithGoogle()
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Authenticated');
        console.log('User Info:', user);
        const empmailid = user.email;
        const empfname = user.displayName;
        if (user.email && user.displayName) {
          const empmailid = user.email;
          const empfname = user.displayName;
          this.b1.createOrGetEmployer(empmailid, empfname);
        }
        else {
          console.error('Employer email is null. Handle this case as needed.');
        }
      })
      .catch((error: any) => {
        console.error('Authentication Error:', error);
      });
  }
  generateOtp(payload: any) {
    this.http.post(`${this.Otp_Url}`, { uid: payload.empid, email: payload.empmailid }).subscribe({
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

}