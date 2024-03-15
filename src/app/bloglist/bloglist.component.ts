import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { blogconst } from 'src/app/constant';

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

  categories: string[] = [
    "programming", "technology", "science", "health", "finance", "sports",
    "travel", "food", "fitness", "lifestyle", "education", "bollywood", "Recently",
    "business", "art", "music", "fashion", "photography", "design", "books", "politics"
  ];

  quotes: string[] = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    // Add other quotes here
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.setQuote(this.getRandomQuote());
    this.fetchLatestBlogs(1); // Load page 1 when the component initializes
    this.fetchTrendingBlogs();
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
      this.blogs = data.blogs;
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
}
