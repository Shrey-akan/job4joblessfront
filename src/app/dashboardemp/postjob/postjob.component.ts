import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { JobPostService } from 'src/app/auth/job-post.service';
import { UserService } from 'src/app/auth/user.service';

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
  jobid!:string;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private jobPostService: JobPostService,
    private userService: UserService,
    public cookie: CookieService
  ) {}

  ngOnInit(): void {
    // Initialize the form with default values and validations
    this.jobPostForm = this.formBuilder.group({
      jobtitle: ['', Validators.required],
      empName: ['', Validators.required],
      empEmail: [
        '',
        [Validators.required, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]
      ],
      companyforthisjob: ['', Validators.required],
      numberofopening: ['', Validators.required],
      locationjob: ['', Validators.required],
      jobtype: ['', Validators.required],
      schedulejob: ['', Validators.required],
      payjob: ['', Validators.required],
      payjobsup: [''],
      descriptiondata: ['', Validators.required],
      empid: ['', Validators.required]
    });

    // Set employee ID from cookie
    this.abc = this.cookie.get('emp');
    this.jobPostForm.get('empid')?.setValue(this.abc);

    // Load saved form data if available
    const savedData = this.jobPostService.loadFormData();
    if (savedData) {
      this.jobPostForm.setValue(savedData);
      this.currentStep = savedData.currentStep || 1;
    }
  }

  // Apply rich text editor command
  applyCommand(command: string): void {
    document.execCommand(command, false, '');
  }

  // Handle form submission
  jobDetailsForm(jobPostForm: { value: any }): void {
    this.jobPostService.saveFormData(jobPostForm.value);

    if (this.currentStep === this.totalSteps) {
      this.userService.jobpostinsert(jobPostForm.value).subscribe({
        next: (resp: PostJob) => {
          console.log('Complete Response:', resp);
        
          if (resp && resp.jobid !== null && resp.jobid !== undefined) {
            this.jobid = resp.jobid;
            console.log('checking the response for jobid', this.jobid);
        
            // Move the navigation inside the subscription callback
            this.router.navigate(['/dashboardemp/set-question', this.jobid]);
        
            localStorage.removeItem('jobPostForm');
            this.jobPostService.clearFormData();
          } else {
            console.error('Jobid is null or undefined in the response.');
          }
        },
        
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  // Navigate to the next step
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }

    this.jobPostService.saveFormData({
      ...this.jobPostForm.value,
      currentStep: this.currentStep
    });
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
