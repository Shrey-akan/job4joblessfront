import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  contactForma: FormGroup;
  formSubmitted: any;
  companyswitch!: FormGroup;
  data: any;
 

  constructor(private formBuilder: FormBuilder , private router:Router, private b1:UserService ) {
    this.contactForma = this.formBuilder.group({
      contacthelp: ['', Validators.required],
      contactname: ['', Validators.required],
     
      contactmail: ['', [Validators.required, Validators.email]],
      contactcompany: ['', Validators.required],
     
      contactphone: ['', Validators.required]
     

      
    });

  }



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
    const showPostJobButtonscom = document.getElementsByClassName('contactform');
    const popupDialogContact = document.getElementById('popupDialogContact');
    const closeButtonContact = document.getElementById('closeButtonContact');

    if (popupDialogContact && closeButtonContact) {
        for (let i = 0; i < showPostJobButtonscom.length; i++) {
            const showPostJobButton = showPostJobButtonscom[i] as HTMLElement;
            showPostJobButton.addEventListener('click', () => {
                popupDialogContact.style.display = 'block';
            });
        }

        closeButtonContact.addEventListener('click', () => {
            popupDialogContact.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === popupDialogContact) {
                popupDialogContact.style.display = 'none';
            }
        });
    }
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




contactdetailsemp(contactForma:{value:any;}) {
  this.router.navigate(['/employer/']);
    // console.log(contactForma.value);
  return this.b1.insertcontact(contactForma.value);
}


switchtoemployer(){
  if (this.companyswitch.valid) {
    // console.log(this.companyswitch.getRawValue());
    // console.log(this.companyswitch);
    return this.b1.logincheckemp(this.companyswitch.getRawValue());
  } else {
    // Form is not valid, display an alert
    alert('Form is not valid. Please check the fields.');
    return; // Return early to prevent further execution
  }
}

}
