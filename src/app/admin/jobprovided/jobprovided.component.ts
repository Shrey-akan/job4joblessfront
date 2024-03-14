import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-jobprovided',
  templateUrl: './jobprovided.component.html',
  styleUrls: ['./jobprovided.component.css']
})
export class JobprovidedComponent implements OnInit{
  
  data: any[] = [];
  pageNumber = 1;
  pageSize = 10;

  constructor(private userService: UserService) { }
  
  ngOnInit(): void {
    this.loadJobData();
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
