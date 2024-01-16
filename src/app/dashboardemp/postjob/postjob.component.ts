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
      locationjob: ['',Validators.required],
      jobtype: ['', Validators.required],
      schedulejob: ['', Validators.required],
      payjob: ['', Validators.required],
      payjobsup: [''],
      descriptiondata: ['', Validators.required],
      empid: ['', Validators.required],
    });
    this.abc = this.cookie.get('emp');

    this.jobPostForm.get('empid')?.setValue(this.abc);

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
  
    this.jobPostService.saveFormData(jobPostForm.value);

    if (this.currentStep === this.totalSteps) {

      this.b1.jobpostinsert(jobPostForm.value).subscribe({
        next: (resp: any) => {
          localStorage.removeItem('jobPostForm');
          this.jobPostService.clearFormData();
          this.router.navigate(['/dashboardemp/alljobs']);
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }
  
  
  

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  
    this.jobPostService.saveFormData({
      ...this.jobPostForm.value,
      currentStep: this.currentStep, 
    });
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
   
    this.jobPostService.saveFormData({
      ...this.jobPostForm.value,
      currentStep: this.currentStep, 
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
