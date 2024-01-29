import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
@Component({
  selector: 'app-floatingbanner',
  templateUrl: './floatingbanner.component.html',
  styleUrls: ['./floatingbanner.component.css']
})
export class FloatingbannerComponent implements OnInit {

  constructor(private fb: FormBuilder, private router:Router , private b1:UserService, private userservice:UserService) {
      }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }



  loginWithGoogle() {
    this.userservice.loginWithGoogle()
      .then((userCredential) => {
        // User is successfully authenticated
        const user = userCredential.user;
        // console.log('Authenticated');
        // console.log('User Info:', user);
        if (user.email) {
          // If the email is not null, proceed with further actions
          const userName = user.email;
          // console.log(userName);
          this.b1.logincheckgmail(userName);
          // this.userservice.insertusermailgog(userName);
        } else {
          // console.error('User email is null. Handle this case as needed.');
        }
      })
      .catch((error) => {
        // console.error('Authentication Error:', error);
      });
  }

  navigateToRegister(){
    this.router.navigate(['/register']);
  }
  navigateToEmployer(){
    this.router.navigate(['/employer']);
  }

  navigateToLogin(){
    this.router.navigate(['login']);
  }
}
