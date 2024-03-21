import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { blogconst} from '../constant';

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
export class CreateblogComponent  {
  blogForm!: FormGroup;
  private blog_const = `${blogconst}`;
  accessToken!: string;
  submitted = false;

  blocksArray: AbstractControl[] = [];
  tagsArray: AbstractControl[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.accessToken = this.cookieService.get('accessToken');

    this.blogForm = this.formBuilder.group({
      title: ['', Validators.required],
      des: ['', Validators.required],
      banner: ['', Validators.required],
      content: this.formBuilder.array([
        this.createContentBlock()
      ]),
      tags: this.formBuilder.array([]),
      draft: [false]
    });

    this.blocksArray = (this.blogForm.get('content') as FormArray).controls;
    this.tagsArray = (this.blogForm.get('tags') as FormArray).controls;
  }

  createContentBlock(): FormGroup {
    return this.formBuilder.group({
      type: ['', Validators.required],
      text: ['', Validators.required]
    });
  }

  addContentBlock(): void {
    const blocks = this.blogForm.get('content') as FormArray;
    blocks.push(this.createContentBlock());
    this.blocksArray = blocks.controls;
  }

  addTag(): void {
    const tags = this.blogForm.get('tags') as FormArray;
    tags.push(this.formBuilder.control(''));
    this.tagsArray = tags.controls as FormControl[]; 
  }

  removeTag(index: number): void {
    const tags = this.blogForm.get('tags') as FormArray;
    tags.removeAt(index);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.blogForm.invalid) { return; }
  
    const formData = new FormData();
    formData.append('title', this.blogForm.get('title')!.value);
    formData.append('des', this.blogForm.get('des')!.value);
    formData.append('banner', this.blogForm.get('banner')!.value);
    formData.append('draft', this.blogForm.get('draft')!.value);
  
    const blocks = this.blogForm.get('content') as FormArray;
    blocks.controls.forEach((control: AbstractControl) => {
      if (control instanceof FormGroup) {
        formData.append('content[blocks][][type]', control.get('type')!.value);
        formData.append('content[blocks][][text]', control.get('text')!.value);
      }
    });
  
    const tags = this.blogForm.get('tags') as FormArray;
    tags.controls.forEach((tag: AbstractControl, index: number) => {
      formData.append(`tags[${index}]`, tag.value);
    });
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'multipart/form-data'
    });
  
    this.http.post(`${this.blog_const}/create-blog`, formData, { headers }).subscribe({
      next: (response) => {
        console.log('Blog data submitted successfully:', response);
        // Handle success response
      },
      error: (error) => {
        console.error('Error submitting blog data:', error);
        // Handle error response
      }
    });
}
}
