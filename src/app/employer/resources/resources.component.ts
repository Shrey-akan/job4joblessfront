import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit{
  constructor(private router:Router){}
    ngOnInit(): void {
    
    }
    gotopage(){
      this.router.navigate(['/employer/empsign']);
        }

}
