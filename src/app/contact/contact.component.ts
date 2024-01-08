import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
 // Define a FormGroup for your form
 contactForm!: FormGroup;

 constructor(private fb: FormBuilder,private router:Router,private h1:UserService) {
   // Initialize the form with FormBuilder
   this.contactForm = this.fb.group({
    name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, this.gmailValidator]],
      contactNumber: ['', [Validators.required, this.contactNumberValidator]],
      message: ['', [Validators.required]],
   });
 }

  // Custom validator for Gmail
  gmailValidator(control: { value: string; }) {
    if (control.value && !control.value.endsWith('@gmail.com')) {
      return { invalidGmail: true };
    }
    return null;
  }

  // Custom validator for 10-digit contact number
  contactNumberValidator(control: { value: any; }) {
    const value = control.value;
    const isValid = /^\d{10}$/.test(value);

    if (!isValid) {
      return { invalidContactNumber: true };
    }
    return null;
  }
 // Handle form submission
 onSubmitForm() {
   if (this.contactForm.valid) {
     // Form data is valid, you can access it using this.contactForm.value
     console.log(this.contactForm.value);
     this.h1.insertfrontform(this.contactForm.value).subscribe(
   {
    next: (response:any)=>{
      if(response === true) {
        alert('Contact form submitted successfully');
        this.router.navigate(['/']);
      }
      else {
        // Handle the case where the backend did not save the data successfully
        alert('Failed to submit contact form');
      }
    },
    error:(err) => {
      alert(err);
    }
   }
    );
   }
 }
}
