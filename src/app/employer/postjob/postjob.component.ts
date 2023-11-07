import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-postjob',
  templateUrl: './postjob.component.html',
  styleUrls: ['./postjob.component.css']
})
export class PostjobComponent implements OnInit {


  companyswitch!: FormGroup;
  formSubmitted: any;
  data: any;


  constructor(private formBuilder: FormBuilder, private router: Router,private b1:UserService) { }



  ngOnInit(): void {
    this.companyswitch = this.formBuilder.group({
      empcompany: ['', [Validators.required]],
      empmailid: [
        '',
        [Validators.required, Validators.email, this.gmailValidator],
      ],
      emppass: ['', [Validators.required]],
    });
    // let responce = this.b1.viewemployerdetailservice();
    // responce.subscribe((data1:any)=>this.data=data1);
    const showPostJobButtons = document.getElementsByClassName('showPostJob');
    const popupDialogJob = document.getElementById('popupDialogJob');
    const closeButtonJob = document.getElementById('closeButtonJob');

    if (popupDialogJob && closeButtonJob) {
      for (let i = 0; i < showPostJobButtons.length; i++) {
        const showPostJobButton = showPostJobButtons[i] as HTMLElement;
        showPostJobButton.addEventListener('click', () => {
          popupDialogJob.style.display = 'block';
        });
      }

      closeButtonJob.addEventListener('click', () => {
        popupDialogJob.style.display = 'none';
      });

      window.addEventListener('click', (event) => {
        if (event.target === popupDialogJob) {
          popupDialogJob.style.display = 'none';
        }
      });
    }

  }
  // Custom validator for Gmail
  gmailValidator(control: { value: string; }) {
    if (control.value && !control.value.endsWith('@gmail.com')) {
      return { invalidGmail: true };
    }
    return null;
  }


  switchtoemployer() {
    if (this.companyswitch.valid) {
      console.log(this.companyswitch.getRawValue());
      console.log(this.companyswitch);
      return this.b1.logincheckemp(this.companyswitch.getRawValue());
    } else {
      // Form is not valid, display an alert
      alert('Form is not valid. Please check the fields.');
      return; // Return early to prevent further execution
    }
  }
  

}
