import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constant';

@Component({
  selector: 'app-pushnotification',
  templateUrl: './pushnotification.component.html',
  styleUrls: ['./pushnotification.component.css']
})
export class PushnotificationComponent implements OnInit {
  title: string = '';
  body: string = '';
  options: any[] = [];
  selectedValues: any[] = [];
  error: string | null = null;
  show: boolean = false;
  color: string | undefined;
  form!: FormGroup;
  constructor(private http: HttpClient,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.fetchTokens();
    this.form = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      selectedValues: [[]]
    });
  }

  fetchTokens(): void {
    this.http.get<any>('https://rocknwoods.website:4000/api/gettoken')
      .subscribe(
        response => {
          this.options = response?.result?.token || [];
        },
        error => {
          console.error('Error fetching options:', error);
        }
      );
  }

  handleSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      this.http.post<any>('https://rocknwoods.website:4000/api/sendmsg', formData)
        .subscribe({
          next: response => {
            if (response && response.data) {
              console.log('message:', response.data);
              // Handle success
            } else {
              console.log('No message received from server');
              // Handle case where response data is undefined
            }
          },
          error: error => {
            console.error('Error sending message:', error);
            // Handle error
          }
        });
    } else {
      // Form is invalid, handle accordingly
    }
}


  closeErrorPopup(): void {
    this.show = false;
  }
}