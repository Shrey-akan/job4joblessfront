import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-updatesubadmin',
  templateUrl: './updatesubadmin.component.html',
  styleUrls: ['./updatesubadmin.component.css']
})
export class UpdatesubadminComponent implements OnInit {
  private backend_URL=`${backendUrl}`;
  subadminId: string = '';
  subadminDetails: any;
  updateForm!: FormGroup; // Define form group

  constructor(private route: ActivatedRoute, private http: HttpClient, private formBuilder: FormBuilder , private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.subadminId = params['id'];
      this.fetchSubAdminDetails(this.subadminId);
    });

    // Initialize form with empty values
    this.updateForm = this.formBuilder.group({
      subadminame: ['', Validators.required],
      subadminmail: ['', [Validators.required, Validators.email]],
      manageUsers: [false, Validators.required],
      manageEmployers: [false, Validators.required],
      postJob: [false, Validators.required],
      applyJob: [false, Validators.required],
      manageBlogs: [false, Validators.required],
      pushNotification: [false, Validators.required],
      approveJobDetails: [false, Validators.required]
    });
  }

  fetchSubAdminDetails(id: string) {
    this.http.get<any>(`${this.backend_URL}subadmindetails/${id}`).subscribe(data => {
      this.subadminDetails = data;
      this.updateForm.patchValue(data); // Populate form with fetched subadmin details
    });
  }

  onSubmit() {
    if (this.updateForm.valid) {
      const formData = this.updateForm.value;
 
      this.http.put(`${this.backend_URL}subadmindetails/${this.subadminId}`, formData).subscribe(
        (response) => {
          console.log('Subadmin details updated successfully:', response);
          this.router.navigate(['/admin/subadmindetails']);
        },
        (error) => {
          console.error('Error updating subadmin details:', error);

        }
      );
    } else {

      this.updateForm.markAllAsTouched();
    }
  }
}
