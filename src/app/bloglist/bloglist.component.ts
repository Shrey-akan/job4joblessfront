import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { blogconst } from 'src/app/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { error } from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from '../interceptors/auth.interceptor';

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
  selector: 'app-bloglist',
  templateUrl: './bloglist.component.html',
  styleUrls: ['./bloglist.component.css']
})
export class BloglistComponent implements OnInit {
  private blog_const = `${blogconst}`;
  blogs: any;
  trendingBlogs: any;
  pageState: string = "home";
  loading: boolean = false;
  quote: string = '';

  searchQuery: string = '';
  filteredBlogs: any[] = [];

  loginform!: FormGroup;
  signupForm!: FormGroup;
  public passwordVisible: boolean = false;
  showLoginForm: boolean = true;
  showSignUpForm: boolean = false;
  screenDisabled: boolean = false;
  SignInloading:boolean = false;
  SignUploading:boolean = false;

  categories: string[] = [
    "programming", "technology", "science", "health", "finance", "sports",
    "travel", "food", "fitness", "lifestyle", "education", "bollywood", "Recently",
    "business", "art", "music", "fashion", "photography", "design", "books", "politics"
  ];

  quotes: string[] = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    // Add other quotes here
  ];

  constructor(private fb: FormBuilder, public cookie: CookieService, private http: HttpClient, private b1: UserService, private userservice: UserService, private router: Router) { }

  ngOnInit(): void {
    this.setQuote(this.getRandomQuote());
    this.fetchLatestBlogs(1); // Load page 1 when the component initializes
    this.fetchTrendingBlogs();
    this.loginform = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]],
      password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]],
    });

    this.signupForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]]
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
    //   $('#signInModal').on('hidden.bs.modal', () => {
    //     this.router.navigate(['/contact-us']);
    // });
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
          console.log(userName);
          this.b1.logincheckgmailBLOG(userName);
        } else {
          console.error('User email is null. Handle this case as needed.');
        }
      })
      .catch((error) => {
      });
  }
  login(form: FormGroup): void {
    if (form.valid) {
      this.SignInloading=true;
      const loginData = {
        email: form.value.email,
        password: form.value.password
      };

      this.http.post<any>(`${this.blog_const}/signin`, loginData).subscribe({
        next: (resp) => {
          if (resp && resp.access_token) {
            const accessToken = resp.access_token;
            this.cookie.set('accessToken', accessToken);
            AuthInterceptor.accessToken = accessToken;

            console.log("Access token is: " + accessToken);
            console.log("Response from server: ", resp);

            const isAuthenticated = resp.access_token !== undefined && resp.access_token !== null;

            console.log("Is authenticated:", isAuthenticated);

            if (isAuthenticated) {
              // Remove alert and directly navigate to the desired route
              $('#signInModal').modal('hide');
              // Show alert and navigate to the desired route after the modal is closed
              alert('Login Successful!');
              this.router.navigate([`/postblog/${accessToken}`]);
            } else {
              alert('Incorrect Credentials!');
              this.router.navigate(['/blogs']);
            }
          } else {
            alert('Incorrect Credentials!');
            this.router.navigate(['/blogs']);
          }
        },
        error: (error) => {
          console.log("Error occurred during login:", error);
          alert('An error occurred during login. Please try again later.');
        }
      });
    }
  }




  signup(form: FormGroup): void {
    if (form.valid) {
      this.SignUploading=true;
      const signupData = {
        fullname: form.value.fullname,
        email: form.value.email,
        password: form.value.password
      };

      this.http.post<any>(`${this.blog_const}/signup`, signupData)
        .subscribe(
          {
            next: (response) => {
              console.log('Signup successful:', response);
              // Handle the response as needed
            },
            error: (error) => {
              if (error.status === 500) {
                alert('User is already Registered...');
              } 
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

  @Input() state: any; // Replace 'any' with the appropriate type for 'state'
  @Input() fetchDataFun: any; // Replace 'any' with the appropriate type for 'fetchDataFun'

  shouldDisplayLoadMoreButton(): boolean {
    return this.state != null && this.state.totalDocs > this.state.results.length;
  }


  loadMoreBlogs(): void {
    // Get the current page of blogs
    const currentPage = this.blogs ? Math.ceil(this.blogs.length / 5) + 1 : 1;

    // Fetch blogs for both the current page and the next page
    for (let page = currentPage; page <= currentPage + 1; page++) {
      this.fetchLatestBlogs(page);
    }
  }

}
