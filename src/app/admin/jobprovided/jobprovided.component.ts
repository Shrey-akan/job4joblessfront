import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-jobprovided',
  templateUrl: './jobprovided.component.html',
  styleUrls: ['./jobprovided.component.css']
})
export class JobprovidedComponent implements OnInit{
  
  data:any;

  constructor(private b1:UserService) { }
  
  ngOnInit(): void {
    let responce = this.b1.fetchjobpost();
    responce.subscribe((data1: any)=>this.data=data1);    
  }

}
