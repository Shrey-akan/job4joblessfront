import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { backendUrl } from 'src/app/constant';

@Component({
  selector: 'app-updatejob',
  templateUrl: './updatejob.component.html',
  styleUrls: ['./updatejob.component.css']
})
export class UpdatejobComponent implements OnInit {
  jobForm!: FormGroup;
  jobid!: string | null;
  private backend_URL=`${backendUrl}`;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.jobForm = this.fb.group({
      jobtitle: ['', Validators.required],
      empName:['',Validators.required],
      empEmail:['',Validators.required ,  Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)],
      companyforthisjob: ['', Validators.required],
      numberofopening: ['', Validators.required],
      locationjob: ['', Validators.required],
      jobtype: ['', Validators.required],
      schedulejob: ['', Validators.required],
      payjob: ['', Validators.required],
      payjobsup: ['', Validators.required],
      descriptiondata: ['', Validators.required]
    });
    
    this.jobid = this.route.snapshot.paramMap.get('jobid');
    this.fetchJobDetails();
  }
  fetchJobDetails() {
    if (this.jobid) {
      this.http.get(`${this.backend_URL}fetchJobPostById/${this.jobid}`)
        .subscribe({
          next: (response: any) => {
            // Assuming response has the job post data in the correct format
            this.jobForm.patchValue(response);
            // Populate form with the job details received
          },
          error: (error: any) => {
            console.error('Error fetching job details', error);
            // Handle error
          }
        });
    }
  }
  updateJob() {
    const formData = this.jobForm.value;

    this.http.put(`${this.backend_URL}jobpostupdate/${this.jobid}`, formData)
      .subscribe(
       {
        next: (response:any) => {
          // console.log('Job updated successfully', response);
          alert("JOB UPDATED SUCCESSFULLY");
          this.router.navigate(['/dashboardemp/alljobs']);
          // Handle success (e.g., show a success message)
        },
        error:(error:any) => {
          console.error('Error updating job', error);
          alert(error);
          // Handle error (e.g., show an error message)
        }
       }
      );
  }
}
