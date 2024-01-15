import { Component, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-myjobs',
  templateUrl: './myjobs.component.html',
  styleUrls: ['./myjobs.component.css']
})
export class MyjobsComponent implements OnInit{
  showFloatingGif = false;
  data:any
  userData1!: any;
  abc:any;
  user: any;
  showDetails = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
  constructor(public cookie:CookieService , private b1:UserService , private router:Router,private elRef: ElementRef, private renderer: Renderer2) {}

  userID: String = "0";
  ngOnInit(): void {
    // this.showFloatingGifAfterDelay();
    this.userID = this.cookie.get('uid');
    let response = this.b1.fetchuser();
    response.subscribe((data1: any) => {
      const uuid=this.userID;
      this.userData1 = data1.find((user: any) => user.uid == uuid);
      this.abc = this.userData1.userName;
      this.fetchApplyJob();
    });
  }

  showFloatingGifAfterDelay() {
    setTimeout(() => {
      this.showFloatingGif = true;
    }, 2000);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInside = this.renderer
      .parentNode(event.target)
      .classList.contains('floating-gif-container');

    if (!clickedInside) {
      this.showFloatingGif = false;
    }
  }
  fetchApplyJob() {
    let response = this.b1.fetchapplyform();

    response
      .subscribe((data1: any) => {
        this.data = data1.filter((apply: any) => apply.uid == this.userID);
        // console.log('Filtered Data:', this.data);
      });
  }
  navigateTo(){
    this.router.navigate(['/dashboarduser']);
  }
}
