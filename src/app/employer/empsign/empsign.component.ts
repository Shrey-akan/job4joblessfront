import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-empsign',
  templateUrl: './empsign.component.html',
  styleUrls: ['./empsign.component.css']
})
export class EmpsignComponent {
  isHovered = false;
  isHovereda = false;
  emailFormemp: FormGroup;
  empsignin!: FormGroup;
  empPasswordVisible: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private readonly authService: UserService) {
    this.emailFormemp = this.formBuilder.group({
      empmail: ['', [Validators.required, Validators.email]]
    });
  }


  ngOnInit(): void {
    this.empsignin = this.formBuilder.group({
      empmailid: ['', [Validators.required, Validators.email]],
      emppass: ['', Validators.required]
    });
  }


  empCheckInfo() {
    // console.log(this.empsignin.getRawValue());
    return this.authService.logincheckemp(this.empsignin.getRawValue());

  }

  loginWithGoogle() {
    this.authService
      .loginWithGoogle()
      .then((userCredential) => {
        // User is successfully authenticated
        const user = userCredential.user;
        // console.log('Authenticated');
        // console.log('User Info:', user.email);
        const empmailid = user.email;
        if (empmailid != null) {
          this.router.navigate(['/dashboardemp/profilemep']);
          return this.authService.employerLoginCheck(empmailid);
        }
        return false;
      })
      .catch((error) => {
        console.error('Authentication Error:', error);
      });
  }


  insertemp() {
    console.log("Done");
    this.router.navigate(['/employer/empregister']);
    // return this.b1.insertempmailadd(emailFormemp.value).subscribe();
  }

  toggleEmpPasswordVisibility() {
    this.empPasswordVisible = !this.empPasswordVisible;
  }
}
