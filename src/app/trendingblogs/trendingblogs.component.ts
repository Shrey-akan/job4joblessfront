import { Component, OnInit , Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { blogconst } from 'src/app/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';


interface Blog {
  blog_id: string;
  title: string;
  banner?: string;
  des?: string;
  content?: any[]; // Change the type to match the actual type of the content
  tags?: string[];
  author: string; // Assuming author is a string representing the ObjectId
  activity: {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
  };
  comments?: string[]; // Assuming comments is an array of strings representing the ObjectIds
  draft?: boolean;
  createdAt?: Date;
}

declare var $: any;

@Component({
  selector: 'app-trendingblogs',
  templateUrl: './trendingblogs.component.html',
  styleUrls: ['./trendingblogs.component.css']
})
export class TrendingblogsComponent implements OnInit {
  private blog_const = `${blogconst}`;
  blogs: any;
  trendingBlogs: any;
  pageState: string = "home";
  loading: boolean = false;
  quote: string = '';
  isloading: boolean = true;

  searchQuery: string = '';
  filteredBlogs: any[] = [];

  loginform!: FormGroup;
  signupForm!: FormGroup;
  public passwordVisible: boolean = false;
  showLoginForm: boolean = true;
  showSignUpForm: boolean = false;

  categories: string[] = [
    "programming", "technology", "science", "health", "finance", "sports",
    "travel", "food", "fitness", "lifestyle", "education", "bollywood", "Recently",
    "business", "art", "music", "fashion", "photography", "design", "books", "politics"
  ];

  quotes: string[] = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    // Add other quotes here
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private b1: UserService, private userservice: UserService , private router :Router) { }

  ngOnInit(): void {
    this.setQuote(this.getRandomQuote());
    this.fetchLatestBlogs(1); // Load page 1 when the component initializes
    this.fetchTrendingBlogs();
    this.loginform = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/.+@gmail\.com$/)]],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/.+@gmail\.com$/)]],
      password: ['', Validators.required]
    });
    // this.filterBlogs();
  }

  getRandomQuote(): string {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }

  setQuote(quote: string): void {
    this.quote = quote;
  }

  fetchLatestBlogs(page: number): void {
    this.loading = true;
    this.isloading=true;
    this.http.post<any>(`${this.blog_const}/latest-blogs`, { page }).subscribe(data => {
      console.log('Latest Blogs Response:', data);
      if (this.blogs && page > 1) {
        // Append new blogs to the existing list
        this.blogs = [...this.blogs, ...data.blogs.slice(0, 5)];
        this.isloading=false;
      } else {
        // Set blogs for the first page
        this.blogs = data.blogs.slice(0, 5);
        this.isloading=false;
      }
      this.isloading=false;
      this.loading = false;
    }, error => {
      console.error('Error fetching latest blogs:', error);
      this.loading = false;
      this.isloading=false;
    });
  }
  


  fetchTrendingBlogs(): void {
    this.loading = true;
    this.http.get<any>(`${this.blog_const}/trending-blogs`).subscribe(data => {
      console.log('Trending Blogs Response:', data);
      this.trendingBlogs = data.blogs;
      this.loading = false;
    }, error => {
      console.error('Error fetching trending blogs:', error);
      this.loading = false;
    });
  }

  loadBlogByCategory(category: string): void {
    if (this.pageState === category) {
      this.pageState = "home";
    } else {
      this.pageState = category;
    }
    this.fetchBlogsByCategory(1);
  }

  fetchBlogsByCategory(page: number): void {
    this.loading = true;
    this.http.post<any>(`${this.blog_const}/search-blogs`, { tag: this.pageState, page }).subscribe(data => {
      console.log('Blogs By Category Response:', data);
      this.blogs = data.blogs;
      this.loading = false;
    }, error => {
      console.error('Error fetching blogs by category:', error);
      this.loading = false;
    });
  }
  

  capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  truncateTitle(title: string): string {
    const words = title.split(' ');
    if (words.length > 9) {
      const truncatedTitle = words.slice(0, 9).join(' ') + '...';
      return truncatedTitle;
    } else {
      return title;
    }
  }

  openSignInModal() {
    $('#signInModal').modal('show');
  }

  closeSignInModal() {
    $('#signInModal').modal('hide'); // Hide the modal
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  loginWithGoogle() {
    this.userservice.loginWithGoogle()
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.email) {
          const userName = user.email;
          this.b1.logincheckgmail(userName);
        } else {
          console.error('User email is null. Handle this case as needed.');
        }
      })
      .catch((error) => {
      });
  }

  login(form: FormGroup): void {
    // form.markAllAsTouched(); 
    if (form.valid) {
      const loginData = {
        email:form.value.email,
        password:form.value.password
      };
      this.http.post<any>(`${this.blog_const}/signin`,loginData)
      .subscribe(
     {
      next:   (respone) =>{
        console.log("Login Successfully",respone);
        this.router.navigate(['postblog']);
      },
      error:(error)=>
      {
        console.log("Error is coming",error);
      }
     }
      );
    }
  }

  signup(form: FormGroup): void {
    if (form.valid) {
      const signupData = {
        fullname: form.value.fullname,
        email: form.value.email,
        password: form.value.password
      };

      this.http.post<any>(`${this.blog_const}/signup`, signupData)
        .subscribe(
       {
        next:   (response) => {
          console.log('Signup successful:', response);
          // Handle the response as needed
        },
        error:(error) => {
          console.error('Error occurred during signup:', error);
          // Handle the error as needed
        }
       }
        );
    }
  }

  showSignIn(): void {
    this.showLoginForm = true;
    this.showSignUpForm = false;
  }

  showSignUp(): void {
    this.showLoginForm = false;
    this.showSignUpForm = true;
  }


  filterBlogs(): void {
    if (this.searchQuery.trim() === '') {
      // If search query is empty, display all blogs
      this.filteredBlogs = this.blogs;
    } else {
      // Filter blogs based on search query in the title or description
      this.filteredBlogs = this.blogs.filter((blog: Blog) =>
        blog.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        (blog.des && blog.des.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }
  }
  

  @Input() state: any; // Replace 'any' with the appropriate type for 'state'
  @Input() fetchDataFun: any; // Replace 'any' with the appropriate type for 'fetchDataFun'
  @Input() showSignInButton = true;

  shouldDisplayLoadMoreButton(): boolean {
    return this.state != null && this.state.totalDocs > this.state.results.length;
  }

  fetchData(): void {
    if (typeof this.fetchDataFun === 'function') {
      this.fetchDataFun({ page: this.state.page + 1 });
    }
  }

  
  loadMoreBlogs(): void {
    // Get the current page of blogs
    const currentPage = this.blogs ? Math.ceil(this.blogs.length / 5) + 1 : 1;
  
    // Fetch blogs for both the current page and the next page
    for (let page = currentPage; page <= currentPage + 1; page++) {
      this.fetchLatestBlogs(page);
    }
  }

  navigateToBlogDetails(blogId: string): void {
    // Navigate to BlogDetailsComponent with the blog ID as a parameter
    this.router.navigate(['/blog/', blogId]);
  }
}
