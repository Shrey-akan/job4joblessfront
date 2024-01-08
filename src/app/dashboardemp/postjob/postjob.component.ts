import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { JobPostService } from 'src/app/auth/job-post.service';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-postjob',
  templateUrl: './postjob.component.html',
  styleUrls: ['./postjob.component.css']
})
export class PostjobComponent implements OnInit {
  jobPostForm!: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  empDetail: any;
  abc: any;
  logval: any;
  constructor(private router: Router, private formbuilder: FormBuilder,private jobPostService: JobPostService, private b1: UserService, public cookie: CookieService) {

  }



  ngOnInit(): void {


    this.jobPostForm = this.formbuilder.group({

      jobtitle: ['', Validators.required],
      companyforthisjob: ['', Validators.required],
      numberofopening: ['', Validators.required],
      locationjob: [''],
      jobtype: [''],
      schedulejob: this.formbuilder.array([]), // For checkboxes
      payjob: [''],
      payjobsup: [''],
      descriptiondata: [''],
      empid: ['', Validators.required],
    });
    this.abc = this.cookie.get('emp');
    // console.log(this.abc);
    this.jobPostForm.get('empid')?.setValue(this.abc);
     // Load saved data from the service (if available)
     const savedData = this.jobPostService.loadFormData();
     if (savedData) {
       this.jobPostForm.setValue(savedData);
       this.currentStep = savedData.currentStep || 1;
     }
 
  }

  applyCommand(command: string): void {
    document.execCommand(command, false, '');
  }

  jobdetailsform(jobPostForm: { value: any }) {
    // Join the 'schedule' array into a comma-separated string
    const scheduleString = jobPostForm.value.schedulejob.join(', ');
    
    // Update the 'schedule' field in the form data
    jobPostForm.value.schedulejob = scheduleString;
  
    // Save the form data to local storage
    this.jobPostService.saveFormData(jobPostForm.value);
  
    if (this.currentStep === this.totalSteps) {
      // Submit the form
      this.b1.jobpostinsert(jobPostForm.value).subscribe({
        next: (resp: any) => {
          // console.log(resp);
          // console.log("Data inserted");
          // Clear the saved data from local storage after a successful submission
          this.jobPostService.clearFormData();
          this.router.navigate(['/dashboardemp/alljobs']);
        },
        error: (err: any) => {
          console.error(err);
          // Handle the error appropriately, e.g., display an error message to the user.
        }
      });
    }
  }
  
  
  

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
    // Save the form data to local storage when clicking "Next"
    this.jobPostService.saveFormData({
      ...this.jobPostForm.value,
      currentStep: this.currentStep, // Save the current step
    });
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
    // Save the form data to local storage when clicking "Previous"
    this.jobPostService.saveFormData({
      ...this.jobPostForm.value,
      currentStep: this.currentStep, // Save the current step
    });
  }

  updateSchedule(event: any, value: string) {
    const scheduleArray = this.jobPostForm.get('schedule') as FormArray;
    if (event.target.checked) {
      scheduleArray.push(this.formbuilder.control(value));
    } else {
      const index = scheduleArray.value.indexOf(value);
      scheduleArray.removeAt(index);
    }
  }
}
