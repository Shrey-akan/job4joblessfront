import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constant';
import { Router } from '@angular/router';


interface SubadminDetails {
  subadminid: string;
  subadminame: string;
  subadminmail: string;
  manageUsers: boolean;
  manageEmployers: boolean;
  postJob: boolean;
  applyJob: boolean;
  manageBlogs: boolean;
  pushNotification: boolean;
  approveJobDetails: boolean;
}


@Component({
  selector: 'app-subadmindetails',
  templateUrl: './subadmindetails.component.html',
  styleUrls: ['./subadmindetails.component.css']
})
export class SubadmindetailsComponent implements OnInit {
  private backend_URL = `${backendUrl}`;

  dataSource: MatTableDataSource<SubadminDetails> = new MatTableDataSource<SubadminDetails>([]);
  displayedColumns: string[] = ['subadminame', 'subadminmail', 'manageUsers', 'manageEmployers', 'postJob', 'applyJob', 'manageBlogs', 'pushNotification', 'approveJobDetails', 'actions', 'actionsa'];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchSubAdminData();
  }

  fetchSubAdminData(): void {
    this.http.get<SubadminDetails[]>(`${this.backend_URL}subadmindetails/all`).subscribe(data => {
      this.dataSource = new MatTableDataSource<SubadminDetails>(data);
    });
  }

  deleteSubAdmin(id: string) {
    if (confirm('Are you sure you want to delete this subadmin?')) {
      this.http.delete(`${this.backend_URL}subadmindetails/${id}`).subscribe(
        (response) => {
          console.log('Subadmin deleted successfully:', response);
          // Optionally, you can refresh the data table after deletion
          this.fetchSubAdminData();
        },
        (error) => {
          console.error('Error deleting subadmin:', error);
          // Handle error (e.g., display error message)
        }
      );
    }

  }

  redirectToUpdateSubadmin(id: string) {
    this.router.navigate(['/admin/updatesubadmin', id]);
  }
}
