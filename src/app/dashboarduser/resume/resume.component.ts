import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
})
export class ResumeComponent implements OnInit {
  @ViewChild('resumeCanvas', { static: false }) resumeCanvas: ElementRef<HTMLCanvasElement> | undefined;
  resumeForm!: FormGroup;
  currentStep = 1;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private http: UserService) {}

  ngOnInit(): void {
    this.resumeForm = this.fb.group({
      rname: ['', Validators.required],
      rmail: ['', [Validators.required, Validators.email]],
      rphone: ['', Validators.required],
      experience: ['', Validators.required],
      skills: ['', Validators.required],
      projectlink: [''],
      description: ['', Validators.required],
    });

    this.loadFormDataFromLocalStorage();
  }

  nextStep() {
    if (this.currentStep === 3) {
      this.submitResume();
      return;
    }

    this.saveFormDataToLocalStorage();
    this.currentStep++;
  }

  prevStep() {
    this.saveFormDataToLocalStorage();
    this.currentStep--;
  }

  submitResume() {
    if (this.resumeForm.valid && !this.isSubmitting) {
      const resumeData = this.resumeForm.value;
      const canvas = this.resumeCanvas?.nativeElement;
      const context = canvas?.getContext('2d');

      if (canvas && context) {
        canvas.width = 800;
        canvas.height = 500;
        context.font = '20px Arial';
        context.fillText('Name: ' + resumeData.rname, 50, 50);
        context.fillText('Email: ' + resumeData.rmail, 50, 100);
        context.fillText('Phone: ' + resumeData.rphone, 50, 150);
        context.fillText('Experience: ' + resumeData.experience, 50, 200);
        context.fillText('Skills: ' + resumeData.skills, 50, 250);
        context.fillText('Project Link: ' + resumeData.projectlink, 50, 300);
        context.fillText('Description: ' + resumeData.description, 50, 350);

        const pdfWindow = window.open('', '_blank');
        if (pdfWindow) {
          pdfWindow.document.open();
          pdfWindow.document.write('<html><body>');
          pdfWindow.document.write('<img src="' + canvas.toDataURL() + '"/>');
          pdfWindow.document.write('</body></html>');
          pdfWindow.document.close();

          setTimeout(() => {
            pdfWindow.print();
          }, 500);
        } else {
          console.error('Failed to open a new window for the PDF.');
        }

        // Set isSubmitting to true to prevent multiple submissions
        this.isSubmitting = true;

        // Send the data to the backend
        this.http.resumeinsert(resumeData).subscribe(
          (response) => {
            // Handle the response from the backend, e.g., show a success message
            console.log('Submitted data to backend:', response);

            // Clear local storage and reset the form only after a successful submission
            this.resumeForm.reset();
            localStorage.removeItem('resumeFormData');
          },
          (error) => {
            // Handle errors, e.g., show an error message
            console.error('Failed to submit data to backend:', error);

            // Set isSubmitting back to false to allow resubmission
            this.isSubmitting = false;
          }
        );
      } else {
        console.error('Canvas or context is not available.');
      }
    }
  }

  loadFormDataFromLocalStorage() {
    const savedData = localStorage.getItem('resumeFormData');
    if (savedData) {
      const formData = JSON.parse(savedData);
      this.resumeForm.patchValue(formData);
    }
  }

  saveFormDataToLocalStorage() {
    localStorage.setItem('resumeFormData', JSON.stringify(this.resumeForm.value));
  }
}
