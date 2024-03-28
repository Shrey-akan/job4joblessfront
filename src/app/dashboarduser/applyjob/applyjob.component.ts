import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';
import { backendUrl } from 'src/app/constant';
import { AbstractControl } from '@angular/forms';

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
  pdfFile: boolean = false;
  formValues: any = {}; 

  private backend_URL = `${backendUrl}`;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private b1: UserService, private cookie: CookieService) { }



  ngOnInit(): void {
    this.uid = this.cookie.get('uid');

    console.log("checking the uid of the user", this.uid);
    // let responce = this.b1.empaccregrepo();
    // responce.subscribe((data1: any)=>this.data=data1);
    this.myformsubmission = this.formBuilder.group({
      juname: ['', [Validators.required , Validators.pattern(/^[A-Za-z\s]+$/)]],
      jumail: ['', [Validators.required, Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]],
      jucompny: ['', Validators.required , Validators.pattern(/^[A-Za-z0-9\s]+$/)],
      jutitle: ['', Validators.required],
      juresume: ['', [Validators.required]],
      jurelocation: ['', [Validators.required]],
      jueducation: ['', [Validators.required]],
      juexperience: ['', [Validators.required,Validators.pattern(/^[0-9]+(?:[,.][0-9]+)?$/)]],
      juinterviewdate: ['' , [ Validators.pattern(/^[\d,-]+$/)]],
      jujobtitle: ['', [ Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      jucompanyname: ['', [ Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      empid: ['', Validators.required],
      jobid: ['', Validators.required],
      uid: this.uid
    })
    // this.formValues = this.myformsubmission.value;
    // Add more steps as needed
    this.b1.jobTitle$.subscribe((jobTitle) => {
      this.jobTitle = jobTitle;
      this.myformsubmission.get('jutitle')?.setValue(jobTitle); // Set jutitle value
    });

    this.b1.jobId$.subscribe((jobId) => {
      this.jobIda = jobId;
    });

    this.b1.companyName$.subscribe((companyName) => {
      this.companyName = companyName;
    });
    this.b1.empId$.subscribe((empId) => {
      this.empId = empId;
      this.myformsubmission.get('empid')?.setValue(empId); // Set empid value
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
    console.log("insertUserForma called with:", myformsubmission);
  
    if (this.currentStep == this.totalSteps) {
      console.log("Current step is equal to total steps. Proceeding to navigate and submit.");
      
      myformsubmission.value.jobid = this.jobIda;
      myformsubmission.value.uid = this.uid;
  
      console.log("Submitting form data:", myformsubmission.value);
      const submissionResult = this.b1.insertapplyjob(myformsubmission.value);
      console.log("Submission result:", submissionResult);
  
      // Navigate after submitting
      this.router.navigate(['/dashboarduser/myjobs']);
    } else {
      console.log("Current step is not equal to total steps. Navigating to dashboarduser.");
      this.router.navigate(['/dashboarduser/applyjob']);
    }
  
    // Clear the localStorage after submitting
    console.log("Clearing localStorage.");
    localStorage.removeItem('applyJobFormData');
  }
  

  ngOnDestroy() {
    // Save the form data to localStorage when the component is destroyed (e.g., when the user leaves the page)
    this.saveFormDataToLocalStorage();
  }

  // nextStep() {
  //   this.currentStep++;
  //   this.saveFormDataToLocalStorage();

  // }
  nextStep(): void {
    // this.currentStep++;
    // this.saveFormDataToLocalStorage();

    if (this.currentStep < this.totalSteps) {
      console.log("Inside the Next Step")
      if (this.currentStep === 1) {
        const name = this.myformsubmission.get('juname');
        const mail = this.myformsubmission.get('jumail');
        const resume = this.myformsubmission.get('juresume');

        if (name?.value && mail?.value && resume?.value) {
          console.log("All required fields are valid....");
          // this.formValues = this.myformsubmission.value;
          this.currentStep++;
          this.uploadFile()
          this.saveFormDataToLocalStorage();

        } else {
          console.log("One or more required fields are empty.");
          // Handle empty fields, e.g., display error message
        }
      }

      else if (this.currentStep === 2) {
        console.log("I am inside step number 2")
        const jrelocation = this.myformsubmission.get('jurelocation');
        const jeducation = this.myformsubmission.get('jueducation');
        const jexperience = this.myformsubmission.get('juexperience');

        if (jrelocation?.value && jeducation?.value && jexperience?.value) {
          console.log("All required fields are valid....");
          this.currentStep++;
          // this.uploadFile()
          this.saveFormDataToLocalStorage();

        } else {
          console.log("One or more required fields are empty.");
          // Handle empty fields, e.g., display error message
        }
      }
      else {
        console.log("Nothing is there")
      }
      // this.formValues = this.myformsubmission.value;
  }
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

  fileValidator(control: AbstractControl): { [key: string]: any } | null {
    const file = control.value;
    if (!file) {
      return { required: true }; // Error if no file is selected
    }
    
    const allowedExtensions = ['.pdf']; // List of allowed file extensions
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (allowedExtensions.indexOf(fileExtension) === -1) {
      return { invalidExtension: true }; // Error if file extension is not allowed
    }
    
    return null; // No error if file is selected and has valid extension
  }
  
  

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const fileExtension = file ? file.name.split('.').pop().toLowerCase() : '';
    if (fileExtension !== 'pdf') {
      this.myformsubmission.get('juresume')?.setErrors({ 'invalidFormat': true });
    } else {
      this.myformsubmission.get('juresume')?.setErrors(null);
    }
  }

  uploadFile() {
    const resume = this.myformsubmission.get('juresume');
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
            console.log('File uploaded successfully');
            this.saveFormDataToLocalStorage();
          },
          error: (error: any) => {
            console.error('File upload failed:', error);
          }
        }
      );
    }
  }


}
