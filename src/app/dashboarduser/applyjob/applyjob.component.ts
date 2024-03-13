import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { backendUrl } from 'src/app/constant';

@Component({
  selector: 'app-applyjob',
  templateUrl: './applyjob.component.html',
  styleUrls: ['./applyjob.component.css']
})
export class ApplyjobComponent implements OnInit {
  selectedFile: File | null = null;
  jobTitle: string | null = null;
  companyName: string | null = null;
  jobIda: string | null = null;
  empId: string | null = null;
  imageSrc: string = 'https://global.discourse-cdn.com/turtlehead/optimized/2X/c/c830d1dee245de3c851f0f88b6c57c83c69f3ace_2_250x250.png';
  myformsubmission!: FormGroup; // Initialize with an empty group
  currentStep = 1;
  totalSteps: number = 3;
  // router: any;
  data: any;
  uid!: string;

  private backend_URL=`${backendUrl}`;
  
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private b1: UserService, private cookie: CookieService) { }



  ngOnInit(): void {
    this.uid = this.cookie.get('uid');

    console.log("checking the uid of the user", this.uid);
    // let responce = this.b1.empaccregrepo();
    // responce.subscribe((data1: any)=>this.data=data1);
    this.myformsubmission = this.formBuilder.group({

      juname: ['', [Validators.required]],
      jumail: ['', [Validators.required, Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]],
      jucompny: ['', Validators.required],
      jutitle: ['', Validators.required],
      juresume: [''],
      jurelocation: ['', [Validators.required]],
      jueducation: ['', [Validators.required]],
      juexperience: ['', [Validators.required]],
      juinterviewdate: [''],
      jujobtitle: ['', Validators.required],
      jucompanyname: ['', Validators.required],
      empid: ['', Validators.required],
      jobid: ['', Validators.required],
      uid: this.uid 
    })
    // Add more steps as needed
    this.b1.jobTitle$.subscribe((jobTitle) => {
      this.jobTitle = jobTitle;
    });

    this.b1.jobId$.subscribe((jobId) => {
      this.jobIda = jobId;
    });

    this.b1.companyName$.subscribe((companyName) => {
      this.companyName = companyName;
    });
    this.b1.empId$.subscribe((empId) => {
      this.empId = empId;
    });
    // Set the value of the form control
    this.myformsubmission.get('jucompny')?.setValue(this.companyName);
    this.myformsubmission.get('jutitle')?.setValue(this.jobTitle);
    this.myformsubmission.get('empid')?.setValue(this.empId);
    this.myformsubmission.get('jobid')?.setValue(this.jobIda);
    this.loadFormDataFromLocalStorage();
    console.log("checking the jobid ", this.jobIda);
  }
  loadFormDataFromLocalStorage() {
    const savedData = localStorage.getItem('applyJobFormData');
    if (savedData) {
      const formData = JSON.parse(savedData);
      this.myformsubmission.patchValue(formData);
    }
  }
  saveFormDataToLocalStorage() {
    localStorage.setItem('applyJobFormData', JSON.stringify(this.myformsubmission.value));
  }

  insertUserForma(myformsubmission: { value: any; }) {
    console.log("Done");
    myformsubmission.value.jobid = this.jobIda;
    this.router.navigate(['/dashboarduser/myjobs']);
    console.log(myformsubmission);

    myformsubmission.value.uid = this.uid;

    return this.b1.insertapplyjob(myformsubmission.value);

    // Clear the localStorage after submitting
    localStorage.removeItem('applyJobFormData');
    this.router.navigate(['/dashboarduser']);
  }

  ngOnDestroy() {
    // Save the form data to localStorage when the component is destroyed (e.g., when the user leaves the page)
    this.saveFormDataToLocalStorage();
  }

  nextStep() {
    this.currentStep++;
    this.saveFormDataToLocalStorage();

  }

  prevStep() {
    this.currentStep--;
    this.saveFormDataToLocalStorage();
  }
  onImageSelect(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;

        if (typeof reader.result === 'string') {
          // console.log('Base64 Image Data:', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    // Get the 'uid' from the cookie
    this.uid = this.cookie.get('uid');
    // console.log("checking the selected file ",this.selectedFile);
    if (this.selectedFile && this.uid) {
      // console.log("checking the selected file ",this.selectedFile);
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('uid', this.uid);
      // console.log("checking the selected file ",formData);
      this.http.post(`${this.backend_URL}uploadPdf`, formData).subscribe(
        {
          next: (response: any) => {
            // console.log('File uploaded successfully');
          },
          error: (error: any) => {
            console.error('File upload failed:', error);
          }
        }
      );
    }
  }


}
