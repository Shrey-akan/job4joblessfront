import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { JobPostService } from 'src/app/auth/job-post.service';
import { UserService } from 'src/app/auth/user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface PostJob {
  jobid: string;
  empName: string;
  empEmail: string;
  jobtitle: string;
  companyforthisjob: string;
  numberofopening: number;
  locationjob: string;
  jobtype: string;
  schedulejob: string;
  payjob: number;
  payjobsup: number;
  descriptiondata: string;
  empid: string;
  sendTime: Date;
}

function nameValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const nameRegex = /^[a-zA-Z\s]*$/; // Regular expression to allow only letters and spaces

  if (!nameRegex.test(control.value)) {
    return { 'invalidName': true };
  }
  return null;
}

@Component({
  selector: 'app-postjob',
  templateUrl: './postjob.component.html',
  styleUrls: ['./postjob.component.css']
})
export class PostjobComponent implements OnInit {
  jobPostForm!: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  abc: any;
  jobid!: string;
  countries: string[] = [];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private jobPostService: JobPostService,
    private userService: UserService,
    public cookie: CookieService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.currentStep = 1;
    // Initialize the form with default values and validations
    this.jobPostForm = this.formBuilder.group({
      jobtitle: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      empName: ['', [Validators.required, nameValidator]],
      empEmail: [
        '',
        [Validators.required, Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@+[A-Za-z0-9.]\b/)]
      ],
      companyforthisjob: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      numberofopening: ['', Validators.required],
      locationjob: ['', Validators.required],
      jobtype: ['', Validators.required],
      schedulejob: ['', Validators.required],
      payjob: ['', Validators.required],
      // payjobsup: ['',Validators.required],
      descriptiondata: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      city: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      empid: ['', Validators.required]
    });


    this.http.get<any[]>('https://restcountries.com/v3/all').subscribe((data) => {
      this.countries = data.map(country => country.name.common).sort();
    });

    // Set employee ID from cookie
    this.abc = this.cookie.get('emp');
    this.jobPostForm.get('empid')?.setValue(this.abc);

    // Load saved form data if available
    const savedData = this.jobPostService.loadFormData();
    if (savedData) {
      // this.jobPostForm.setValue(savedData);
      this.currentStep = savedData.currentStep || 1;
    }
    this.jobPostForm.get('country')?.valueChanges.subscribe(() => {
      this.updateLocation();
    });
    this.jobPostForm.get('state')?.valueChanges.subscribe(() => {
      this.updateLocation();
    });
    this.jobPostForm.get('city')?.valueChanges.subscribe(() => {
      this.updateLocation();
    });
  }

  // Apply rich text editor command
  applyCommand(command: string): void {
    document.execCommand(command, false, '');
  }

  updateLocation() {
    const country = this.jobPostForm.get('country')?.value;
    const state = this.jobPostForm.get('state')?.value;
    const city = this.jobPostForm.get('city')?.value;

    // Update the location field
    const countryControl = this.jobPostForm.get('country');
    const stateControl = this.jobPostForm.get('state');
    const cityControl = this.jobPostForm.get('city');
    if (countryControl?.valid && stateControl?.valid && cityControl?.valid) {
      // Update the location field
      this.jobPostForm.get('locationjob')?.setValue(`${city}, ${state}, ${country}`);
    } else {
      // Clear the location field if any of the fields are not valid
      this.jobPostForm.get('locationjob')?.setValue('');
    }
  }

  // Handle form submission
  jobDetailsForm(jobPostForm: { value: any }): void {
    this.jobPostService.saveFormData(jobPostForm.value);

    if (this.currentStep === this.totalSteps) {
      this.userService.jobpostinsert(jobPostForm.value).subscribe({
        next: (resp: any) => {
          console.log('Complete Response:', resp);

          if (resp !== null) {
            this.currentStep = 1;
            this.jobid = resp;
            console.log('checking the response for jobid', this.jobid);

            // Move the navigation inside the subscription callback
            this.router.navigate(['/dashboardemp/set-question', this.jobid]);

            localStorage.removeItem('jobPostForm');
            this.jobPostService.clearFormData();
          } else {
            console.error('Job Id is null or undefined in the response.');
          }
        },

        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  // updateLocationJob(): void {
  //   const country = this.jobPostForm.get('country')?.value;
  //   const state = this.jobPostForm.get('state')?.value;
  //   const city = this.jobPostForm.get('city')?.value;

  //   let currentLocation = this.jobPostForm.get('locationjob')?.value;
  //   currentLocation = currentLocation ? currentLocation + ', ' : '';
  //   const newLocation = currentLocation + city + ', ' + state + ', ' + country;

  //   // Update locationjob with the new concatenated value
  //   this.jobPostForm.patchValue({ locationjob: newLocation });
  // }

  // Navigate to the next step
  nextStep(): void {
    // if (this.jobPostForm.valid) {
    //   console.log(this.jobPostForm);
    //   if (this.currentStep < this.totalSteps) {
    //     this.currentStep++;
    //   }

    //   this.jobPostService.saveFormData({
    //     ...this.jobPostForm.value,
    //     currentStep: this.currentStep
    //   });
    // }
    if (this.currentStep < this.totalSteps) {
      console.log("Inside the Next Step")
      if (this.currentStep === 1) {
        const jobTitleControl = this.jobPostForm.get('jobtitle');
        const companyforthisjobControl = this.jobPostForm.get('companyforthisjob');
        const empNameControl = this.jobPostForm.get('empName');
        const empEmailControl = this.jobPostForm.get('empEmail');

        if (jobTitleControl?.value && companyforthisjobControl?.value && empNameControl?.value && empEmailControl?.value) {
          console.log("All required fields are valid....");
          this.currentStep++;
          this.jobPostService.saveFormData({
            ...this.jobPostForm.value,
            currentStep: this.currentStep
          });

        } else {
          console.log("One or more required fields are empty.");
          // Handle empty fields, e.g., display error message
        }
      }

      if (this.currentStep === 2) {
        const openings = this.jobPostForm.get('numberofopening');
        const location = this.jobPostForm.get('locationjob');
        const jobType = this.jobPostForm.get('jobtype');
        const scheduleJob = this.jobPostForm.get('schedulejob');
        const payJob = this.jobPostForm.get('payjob');
        const desc = this.jobPostForm.get('descriptiondata');


        if (openings?.value && location?.value && jobType?.value && scheduleJob?.value && payJob?.value && desc?.value) {
          console.log("All required fields are valid....");
          this.currentStep++;
          this.jobPostService.saveFormData({
            ...this.jobPostForm.value,
            currentStep: this.currentStep
          });

        } else {
          console.log("One or more required fields are empty.");
          // Handle empty fields, e.g., display error message
        }
      }
      // this.currentStep++;

    }

    // this.jobPostService.saveFormData({
    //   ...this.jobPostForm.value,
    //   currentStep: this.currentStep
    // });
  }

  // Navigate to the previous step
  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }

    this.jobPostService.saveFormData({
      ...this.jobPostForm.value,
      currentStep: this.currentStep
    });
  }

}
