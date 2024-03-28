import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { blogconst } from '../constant';
import { Observable , throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

interface ContentBlock {
  type: string;
  data: {
    text: string;
  };
}

@Component({
  selector: 'app-createblog',
  templateUrl: './createblog.component.html',
  styleUrls: ['./createblog.component.css']
})
export class CreateblogComponent {
  //   blogForm!: FormGroup;
  //   private blog_const = `${blogconst}`;
  //   accessToken!: string;
  //   submitted = false;

  //   blocksArray: AbstractControl[] = [];
  //   tagsArray: AbstractControl[] = [];

  //   constructor(
  //     private formBuilder: FormBuilder,
  //     private http: HttpClient,
  //     private cookieService: CookieService
  //   ) { }

  //   ngOnInit(): void {
  //     this.accessToken = this.cookieService.get('accessToken');

  //     this.blogForm = this.formBuilder.group({
  //       title: ['', Validators.required],
  //       des: ['', Validators.required],
  //       banner: ['', Validators.required],
  //       content: this.formBuilder.array([
  //         this.createContentBlock()
  //       ]),
  //       tags: this.formBuilder.array([]),
  //       draft: [false]
  //     });

  //     this.blocksArray = (this.blogForm.get('content') as FormArray).controls;
  //     this.tagsArray = (this.blogForm.get('tags') as FormArray).controls;
  //   }

  //   createContentBlock(): FormGroup {
  //     return this.formBuilder.group({
  //       type: ['', Validators.required],
  //       text: ['', Validators.required]
  //     });
  //   }

  //   addContentBlock(): void {
  //     const blocks = this.blogForm.get('content') as FormArray;
  //     blocks.push(this.createContentBlock());
  //     this.blocksArray = blocks.controls;
  //   }

  //   addTag(): void {
  //     const tags = this.blogForm.get('tags') as FormArray;
  //     tags.push(this.formBuilder.control(''));
  //     this.tagsArray = tags.controls as FormControl[]; 
  //   }

  //   removeTag(index: number): void {
  //     const tags = this.blogForm.get('tags') as FormArray;
  //     tags.removeAt(index);
  //   }

  //   onSubmit(): void {
  //     this.submitted = true;
  //     if (this.blogForm.invalid) { return; }

  //     const formData = new FormData();
  //     formData.append('title', this.blogForm.get('title')!.value);
  //     formData.append('des', this.blogForm.get('des')!.value);
  //     formData.append('banner', this.blogForm.get('banner')!.value);
  //     formData.append('draft', this.blogForm.get('draft')!.value);

  //     const blocks = this.blogForm.get('content') as FormArray;
  //     blocks.controls.forEach((control: AbstractControl) => {
  //       if (control instanceof FormGroup) {
  //         formData.append('content[blocks][][type]', control.get('type')!.value);
  //         formData.append('content[blocks][][text]', control.get('text')!.value);
  //       }
  //     });

  //     const tags = this.blogForm.get('tags') as FormArray;
  //     tags.controls.forEach((tag: AbstractControl, index: number) => {
  //       formData.append(`tags[${index}]`, tag.value);
  //     });

  //     const headers = new HttpHeaders({
  //       'Authorization': `Bearer ${this.accessToken}`,
  //       'Content-Type': 'multipart/form-data'
  //     });

  //     this.http.post(`${this.blog_const}/create-blog`, formData, { headers }).subscribe({
  //       next: (response) => {
  //         console.log('Blog data submitted successfully:', response);
  //       },
  //       error: (error) => {
  //         console.error('Error submitting blog data:', error);
  //       }
  //     });
  // }

  blogForm: FormGroup;
  private apiUrl = 'https://hustleforwork.com:3000/create-blog';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      des: ['', Validators.required],
      banner: [''],
      tags: this.fb.array(['']), // Initialize with one tag input
      // content: this.fb.array([]),
      content:['', Validators.required],
      draft: [false]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      console.log("Token in CreateBlog component:", token);
      // Do whatever you need to do with the token
    });
    this.addContentBlock(); // Add initial content block
  }

  createBlogData(blogData: any , token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, blogData).pipe(
      catchError(error => {
        console.error('Server error:', error);
        return throwError('Server error occurred');
      })
    );
  }

  get contentBlocks(): FormArray {
    return this.blogForm.get('content') as FormArray;
  }

  get tags(): FormArray {
    return this.blogForm.get('tags') as FormArray;
  }

  addTag(): void {
    this.tags.push(this.fb.control(''));
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  addContentBlock(): void {
    this.contentBlocks.push(this.createContentBlock());
  }

  createContentBlock(): FormGroup {
    return this.fb.group({
      type: ['paragraph', Validators.required], // Default type to 'paragraph'
      data: this.fb.group({
        text: [''] // Ensure 'text' field is properly initialized
      })
    });
  }

  removeContentBlock(index: number): void {
    this.contentBlocks.removeAt(index);
  }

  createBlog(): void {
    // Retrieve the token from the query parameters
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      console.log("Token in CreateBlog component:", token);
      
      // Add the token to the blogForm value
      const blogData = {
        title: this.blogForm.value.title,
        des: this.blogForm.value.des,
        banner: this.blogForm.value.banner,
        tags: this.blogForm.value.tags.filter((tag: string) => tag.trim()), // Filter out empty tags
        content: {
          blocks: this.blogForm.value.content.map((block: any) => ({
            type: block.type,
            data: {
              text: block.data.text // Access the 'text' property of the 'data' object
            }
          }))
        },
        draft: this.blogForm.value.draft,
        // token: token // Adding token to the blogData
      };

      console.log("Blog data:", blogData); 

      if (this.blogForm.valid) {
        this.createBlogData(blogData , token).subscribe(
          response => {
            console.log('Blog created successfully:', response);
            // Reset form
            this.blogForm.reset();
            // Clear content blocks
            this.contentBlocks.clear();
            // Add initial content block
            this.addContentBlock();
          },
          error => {
            console.error('Error creating blog:', error);
          }
        );
      } else {
        console.error('Invalid blog data');
      }
    });
  }
}
