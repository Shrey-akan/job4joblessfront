import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminserviceService } from '../admin/adminauth/adminservice.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';

interface Admin {

  adminName: String;
  adminMail: String;
  adminPass: String;
  adminId: String;

}

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent implements OnInit {
  myForm!: FormGroup;
  public passwordVisible: boolean = false;
  showFooter = false;
  constructor(private formBuilder: FormBuilder, private cookie: CookieService, private router: Router, private adminauth: AdminserviceService) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      userType: ['', Validators.required],
      adminMail: ['', [Validators.required, Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]],
      adminPass: ['', [Validators.required, Validators.minLength(6)]],
      subadminmail: ['', [Validators.required, Validators.email]],
      subadminpassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.myForm.valid && this.myForm.get('userType')?.value) {
      const formData = this.myForm.value;

      if (formData.userType === 'admin') {
        const adminFormData = {
          adminMail: formData.adminMail,
          adminPass: formData.adminPass
        };

        this.adminauth.loginCheck(adminFormData).subscribe({
          next: (response: any) => {
            // Your handling for admin login response
            if (response.accessToken && response.refreshToken && response.adminid) {
              const mainres: Admin = response;
              this.cookie.set('userType', 'admin');
              this.cookie.set('accessToken', response.accessToken);
              this.cookie.set('adminid', response.adminid);
              this.cookie.set('refreshToken', response.refreshToken);

              const accessToken = response.accessToken;
              AuthInterceptor.accessToken = accessToken;

              const isAuthenticated = response.accessToken && response.adminid;
              console.log(isAuthenticated);
              if (isAuthenticated) {
                alert('Login Successful!');
                this.router.navigate(['/admin']);
              } else {

                alert('Incorrect Credentials!');
                this.router.navigate(['/admin']);
              }
            } else {

              alert("Invalid response format");
            }
          },
          error: (err: any) => {
            // Your error handling for admin login
          }
        });
      }else if (formData.userType === 'subadmin') {
      const subAdminFormData = {
        subadminmail: formData.subadminmail,
        subadminpassword: formData.subadminpassword
      };

      this.adminauth.subadminLoginCheck(subAdminFormData).subscribe({
        next: (response: any) => {
          // Your handling for subadmin login response
          if (response.accessToken && response.refreshToken && response.subadminid) {
            this.cookie.set('userType', 'subadmin');
            this.cookie.set('accessToken', response.accessToken);
            this.cookie.set('subadminid', response.subadminid);
            this.cookie.set('refreshToken', response.refreshToken);

            const accessToken = response.accessToken;
            AuthInterceptor.accessToken = accessToken;

            const isAuthenticated = response.accessToken && response.subadminid;
            if (isAuthenticated) {
              alert('Login Successful!');
              this.router.navigate(['/admin']);
            } else {
              alert('Incorrect Credentials!');
              this.router.navigate(['/admin']);
            }
          } else {
            alert("Invalid response format");
          }
        },
        error: (err: any) => {
          // Your error handling for subadmin login
          alert('Incorrect Credentials!');
          console.log("Error is: ", err);
        }
      });
      }
      else{
        console.log("Nothing Type")
      }
    }
  }


  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
