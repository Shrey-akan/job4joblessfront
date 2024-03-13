import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { backendUrl } from 'src/app/constant';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-subadmin',
  templateUrl: './subadmin.component.html',
  styleUrls: ['./subadmin.component.css']
})
export class SubadminComponent implements OnInit{
  adminForm!: FormGroup;

  private backend_URL=`${backendUrl}`;

  constructor(private formBuilder: FormBuilder , private http: HttpClient) { }

  ngOnInit(): void {
    this.adminForm = this.formBuilder.group({
      subadminame: ['', Validators.required],
      subadminmail: ['', [Validators.required, Validators.email]],
      subadminpassword: ['', [Validators.required, Validators.minLength(6)]],
      manageUsers: [false],
      manageEmployers: [false],
      postJob: [false],
      applyJob: [false],
      manageBlogs: [false],
      pushNotification: [false],
      approveJobDetails: [false]
    });
  }

  onSubmit() {
    if (this.adminForm.valid) {
      console.log(this.adminForm.value);
      this.http.post(`${this.backend_URL}subadmindetails/add`, this.adminForm.getRawValue()).subscribe(
        (payload: any) => {
          console.log("Successfully added to database...");
          console.log("checking after running api", this.adminForm);
        },
        (err) => {
          console.error('Some error occurred:', err);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  } 
}
