import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { blogconst } from 'src/app/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { UserService } from '../auth/user.service';

interface Blog {
  _id:string;
  blog_id: string;
  title: string;
  banner?: string;
  des?: string;
  approved:boolean;
  // content?: any[]; // Change the type to match the actual type of the content
  // tags?: string[];
  // author: string; // Assuming author is a string representing the ObjectId
  // activity: {
  //   total_likes: number;
  //   total_comments: number;
  //   total_reads: number;
  //   total_parent_comments: number;
  // };
  // comments?: string[]; // Assuming comments is an array of strings representing the ObjectIds
  // draft?: boolean;
  // createdAt?: Date;
}

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent {

  private blog_const = `${blogconst}`;
  blogs: any;
  pageState: string = "home";
  loading: boolean = false;
  showButtonContent: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchLatestBlogs(1);
  }


  fetchLatestBlogs(page: number): void {
    this.loading = true;
    this.http.post<any>(`${this.blog_const}/latest-blogs`, { page }).subscribe(data => {
      console.log('Latest Blogs Response:', data);
      if (this.blogs && page > 1) {
        // Append new blogs to the existing list
        this.blogs = [...this.blogs, ...data.blogs.slice(0, 5)];
      } else {
        // Set blogs for the first page
        this.blogs = data.blogs.slice(0, 5);
      }
      this.loading = false;
    }, error => {
      console.error('Error fetching latest blogs:', error);
      this.loading = false;
    });
  }

  loadMoreBlogs(): void {
    if (!this.blogs) {
      this.blogs = []; // Initialize blogs array if it's undefined
    }
    const nextPage = (this.blogs.length / 5) + 1; // Calculate the next page based on the current number of blogs
    this.fetchLatestBlogs(nextPage);
  }

  // toggleButtonContent(): void {
  //   this.showButtonContent = !this.showButtonContent;
  // }
  toggleButtonContent(index: number): void {
    this.blogs[index].showContent = !this.blogs[index].showContent;
  }

  toggleButtonActivate(index: number): void {
    const blog = this.blogs[index];
    const blogId = blog._id;
  
    // Update the isActive property immediately to provide instant feedback to the user
    blog.isActive = !blog.isActive;
  
    // Call the server API to toggle the approval status
    this.http.put<any>(`https://hustleforwork.com:3000/toggle-approval/${blogId}`, {}).subscribe({
      next: response => {
        // Handle success
        console.log('Blog approval status toggled:', response);
        // Update the isActive property based on the server response
        blog.isActive = response.blog.approved;
      },
      error: error => {
        // Handle error
        console.error('Failed to toggle blog approval status:', error);
        // Revert the isActive property if the API call fails
        blog.isActive = !blog.isActive;
      }
    });
  }
  
  
  

}
