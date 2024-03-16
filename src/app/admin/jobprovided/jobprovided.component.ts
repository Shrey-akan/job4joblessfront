import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constant';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-jobprovided',
  templateUrl: './jobprovided.component.html',
  styleUrls: ['./jobprovided.component.css']
})
export class JobprovidedComponent implements OnInit{
  
  data: any[] = [];
  pageNumber = 1;
  pageSize = 10;

  jobPosts: any[] = [];
  private backend_URL = `${backendUrl}`;


  constructor(private userService: UserService , private http: HttpClient) { }
  
  ngOnInit(): void {
    // this.loadJobData();
    this.fetchJobPosts();
  }

  fetchJobPosts(): void {
    this.http.get<any[]>(`${this.backend_URL}fetchjobpostadmin`)
      .subscribe(
      {
        next:  (response) => {
          this.jobPosts = response;
        },
        error:(error) => {
          console.error('Error fetching job posts:', error);
        }
      }
      );
  }

  approveJob(jobId: string): void {
    this.http.put<any>(`${this.backend_URL}jobpostupdate/${jobId}`, {})
      .pipe(
        catchError((error) => {
          console.error('Error updating job post approval status:', error);
          return throwError(error);
        })
      )
      .subscribe(
        (response) => {
          // Job post approval status updated successfully
          console.log('Job post approval status updated:', response);
          this.fetchJobPosts();
          // You can perform any additional actions if needed
        }
      );
  }
  
  loadJobData() {
    // this.userService.fetchjobpost(this.pageNumber, this.pageSize)
    //   .subscribe((response: any) => {
    //     this.data = response;
    //   });
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.loadJobData();
  }

}
