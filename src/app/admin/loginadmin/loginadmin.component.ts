import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminserviceService } from '../adminauth/adminservice.service';

@Component({
  selector: 'app-loginadmin',
  templateUrl: './loginadmin.component.html',
  styleUrls: ['./loginadmin.component.css']
})
export class LoginadminComponent implements OnInit {
  myForm!: FormGroup;
  public passwordVisible: boolean = false;
  showFooter = false;
  constructor(private formBuilder: FormBuilder, private router: Router,private adminauth:AdminserviceService) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      adminMail: ['', [Validators.required, Validators.email]],
      adminPass: ['', [Validators.required, Validators.minLength(6)]]

    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      this.adminauth.loginCheck(formData).subscribe(
    {
      next : (Response:any) => {
        if(Response === true){
          alert("Login SuccessFull");
          this.router.navigate(['/admin/dashboardadmin']);
        }
        else{
          this.router.navigate(['/admin']);
        }
      },
      error: (err: any) => {
        alert(err);
      }
    }
      );
    }
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
