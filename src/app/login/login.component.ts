import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginform!: FormGroup;
  public passwordVisible: boolean = false;
  constructor(private fb: FormBuilder, private router:Router , private b1:UserService, private userservice:UserService) {
      }

  ngOnInit(): void {
    this.loginform = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern(/.+@gmail\.com$/)]],
      userPassword: ['', Validators.required],
    });
  }

  public login(loginform:{value:any;}) {
   
   return this.b1.logincheck(loginform.value);

  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  loginWithGoogle() {
    this.userservice.loginWithGoogle()
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.email) {
          const userName = user.email;
          this.b1.logincheckgmail(userName);
        } else {
          console.error('User email is null. Handle this case as needed.');
        }
      })
      .catch((error) => {
      });
  }
}
