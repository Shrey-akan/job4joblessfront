import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray , AbstractControl } from '@angular/forms';
import { blogconst } from '../constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, throwError } from 'rxjs';

interface Blog {
  blog_id: string;
  title: string;
  banner?: string;
  des?: string;
  content?: { blocks: Block[] }[];
  tags?: string[];
  draft?: boolean;
}

interface Block {
  id: string;
  type: string;
  data: {
    text?: string;
  };
}

@Component({
  selector: 'app-createblog',
  templateUrl: './createblog.component.html',
  styleUrls: ['./createblog.component.css']
})
export class CreateblogComponent implements OnInit {
  blogForm!: FormGroup;
  submitted = false;
  private blog_const = `${blogconst}`;
  accessToken!: string;
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.blogForm = this.formBuilder.group({
      title: ['', Validators.required],
      banner: ['', Validators.required],
      des: ['', Validators.required],
      // content: this.formBuilder.array([]),
      content: this.formBuilder.array([this.createContentBlock()]),
      tags: [''],
      draft: [false]
    });
    this.addContentBlock();
    this.accessToken = this.cookieService.get('accessToken');
  }

  // Convenience getter for easy access to form fields
  get f() { return this.blogForm.controls; }

  createContentBlock(): FormGroup {
    return this.formBuilder.group({
      text: ['']
    });
  }

  get contentControls() {
    return (this.blogForm.get('content') as FormArray).controls;
  }

  addContentBlock() {
    const contentArray = this.blogForm.get('content') as FormArray;
    contentArray.push(this.createContentBlock());
  }

  onSubmit() {
    this.submitted = true;
  
    if (this.blogForm.invalid) {
      return;
    }
    console.log("Access token is:", this.accessToken);
    
    const blogData: Blog = this.blogForm.value;
  
    console.log('Submitted Blog:', blogData);
  
    // Set the authorization header
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  
    console.log("This is the header", headers);
  
    // POST the blogData to the API
    this.createBlog(blogData, this.accessToken)
    .subscribe({
      next: (response) => {
        console.log('Blog created successfully:', response);
        // Handle success response
      },
      error: (error) => {
        console.error('Error creating blog:', error);
        // Handle error response
      }
    });
  }

  createBlog(blogData: any, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
  
    return this.http.post<any>(`${this.blog_const}/create-blog`, blogData, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('HTTP Error:', error);
          return throwError('HTTP Error: ' + error.message || 'Server error');
        })
      );
  }
}
