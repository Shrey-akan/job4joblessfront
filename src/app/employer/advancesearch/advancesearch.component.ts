import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-advancesearch',
  templateUrl: './advancesearch.component.html',
  styleUrls: ['./advancesearch.component.css']
})
export class AdvancesearchComponent {
  fincvwit: FormGroup;

  @Output() formSubmitted = new EventEmitter<{ companyName: string; email: string }>();

  constructor(private formBuilder: FormBuilder) {
    this.fincvwit = this.formBuilder.group({
      allofword: ['', Validators.required],
      theexactphrase: ['', [Validators.required]
    ],
    atleastone: ['', Validators.required],
    noneword: ['', Validators.required],
  
    tolj: ['', Validators.required],
    toaj: ['', Validators.required],
    colj: ['', Validators.required],
    coanyj: ['', Validators.required],
    yearofworkex: ['', Validators.required],
    collegeuniname: ['', Validators.required],
    fieldofstudy: ['', Validators.required],
    wherelocation: ['', Validators.required],
    cvlastupdated:['',Validators.required]
    });
  }

  onSubmit() {
    if (this.fincvwit.valid) {
      // console.log("Valid");
      // console.log(this.fincvwit.value);
    }
    else{
      // console.log("Error");
    }
  }
}
