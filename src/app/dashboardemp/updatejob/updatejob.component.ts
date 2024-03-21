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
  countries: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.jobForm = this.fb.group({
      // jobtitle: ['', Validators.required],
      // empName:['',Validators.required],
      // empEmail:['',Validators.required ,  Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)],
      // companyforthisjob: ['', Validators.required],
      // numberofopening: ['', Validators.required],
      // locationjob: ['', Validators.required],
      // jobtype: ['', Validators.required],
      // schedulejob: ['', Validators.required],
      // payjob: ['', Validators.required],
      // payjobsup: ['', Validators.required],
      // descriptiondata: ['', Validators.required]
      jobtitle: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      empName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      empEmail: [
        '',
        [Validators.required, Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]
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

    this.jobForm.get('country')?.valueChanges.subscribe(() => {
      this.updateLocation();
    });
    this.jobForm.get('state')?.valueChanges.subscribe(() => {
      this.updateLocation();
    });
    this.jobForm.get('city')?.valueChanges.subscribe(() => {
      this.updateLocation();
    });
    
    this.jobid = this.route.snapshot.paramMap.get('jobid');
    this.fetchJobDetails();
  }
  fetchJobDetails() {
    if (this.jobid) {
      this.http.get(`${this.backend_URL}fetchJobPostById/${this.jobid}`)
        .subscribe({
          next: (response: any) => {
            
            console.log("show data",response);
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
  updateLocation() {
    const country = this.jobForm.get('country')?.value;
    const state = this.jobForm.get('state')?.value;
    const city = this.jobForm.get('city')?.value;

    // Update the location field
    const countryControl = this.jobForm.get('country');
    const stateControl = this.jobForm.get('state');
    const cityControl = this.jobForm.get('city');
    if (countryControl?.valid && stateControl?.valid && cityControl?.valid) {
      // Update the location field
      this.jobForm.get('locationjob')?.setValue(`${city}, ${state}, ${country}`);
    } else {
      // Clear the location field if any of the fields are not valid
      this.jobForm.get('locationjob')?.setValue('');
    }
  }
}
