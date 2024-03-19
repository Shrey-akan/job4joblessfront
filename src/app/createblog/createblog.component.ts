import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { blogconst } from '../constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

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
      content: this.formBuilder.array([]),
      tags: [''],
      draft: [false]
    });

    this.accessToken = this.cookieService.get('accessToken');
  }

  // Convenience getter for easy access to form fields
  get f() { return this.blogForm.controls; }

  get contentControls() { return (this.blogForm.get('content') as FormArray).controls; } // Getter for content form array controls

  // Add a new content block
  addContentBlock() {
    const content = this.formBuilder.group({
      blocks: ['', Validators.required] // Add validators for content blocks
    });
    (this.blogForm.get('content') as FormArray).push(content);
  }

  onSubmit() {
    this.submitted = true;

    if (this.blogForm.invalid) {
      return;
    }
    console.log("helo shreyans jain");
    console.log("Access token is:",this.accessToken);
    const blogData: Blog = this.blogForm.value;

    console.log('Submitted Blog:', blogData);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });

    console.log("This is the header",headers);
    // POST the blogData to the API
    this.http.post<any>(`${this.blog_const}/create-blog`, blogData, { headers })
    .subscribe(
      (response) => {
        console.log('Blog created successfully:', response);
        // Perform further actions if needed
      },
      (error) => {
        if (error.status === 401) {
          console.error('Unauthorized error. Check access token validity or refresh token.');
        } else {
          console.error('Error creating blog:', error);
        }
      }
    );
  }
}
