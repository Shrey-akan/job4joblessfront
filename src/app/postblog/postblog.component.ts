import { Component, OnInit , Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { blogconst } from 'src/app/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';

@Component({
  selector: 'app-postblog',
  templateUrl: './postblog.component.html',
  styleUrls: ['./postblog.component.css']
})
export class PostblogComponent {

  constructor(private router :Router){}

  createBlog():void{
    this.router.navigate(['createblog']);
  }
}
