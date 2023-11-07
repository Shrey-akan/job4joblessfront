import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-findcv',
  templateUrl: './findcv.component.html',
  styleUrls: ['./findcv.component.css']
})
export class FindcvComponent {
  constructor(private router:Router){}

  showPage(){
    this.router.navigate(['/employer/advancesearch']);
  }
  goToSignIn(){
    this.router.navigate(['/employer/sign-in-emp']);
  }
  navigateTo(){
    this.router.navigate(['/employer/empsign']);
  }
}
