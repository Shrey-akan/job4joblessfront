import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constant';

@Component({
  selector: 'app-pushnotification',
  templateUrl: './pushnotification.component.html',
  styleUrls: ['./pushnotification.component.css']
})
export class PushnotificationComponent{

  notificationForm!: FormGroup;
  private backend_URL = `${backendUrl}`;

  constructor(private formBuilder: FormBuilder , private http: HttpClient) { }

  ngOnInit(): void {
    this.notificationForm = this.formBuilder.group({
      nhead: ['', Validators.required],
      nsubhead: ['', Validators.required],
      ndescription: ['', Validators.required],
      notisend: ['', Validators.required],
      notifyuid: ['', Validators.required],
      sendTime: ['', Validators.required]
    });
  }

}
