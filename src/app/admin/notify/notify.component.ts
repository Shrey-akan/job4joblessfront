import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit {
  notificationForm!: FormGroup;
  uid!: string | null;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //   // Retrieve the uid from the route parameters
    //   this.uid = +params['userId'];
    this.uid = this.route.snapshot.paramMap.get("userId");
      // Initialize the form with the uid as a number
      this.notificationForm = this.formBuilder.group({
        notifyuid: [this.uid, Validators.required], // Initialize with the uid value as a number
        nhead: ['', Validators.required],
        nsubhead: [''],
        ndescription: [''],
        notisend: ['', Validators.required]
      });
 
    
  
  }
  shareNotification() {
    if (this.notificationForm.valid) {
      const formData = this.notificationForm.value;
      console.log('Notification shared:', formData);
      
      this.userService.insertnotification(formData);
        // .subscribe(
        //   (response) => {
        //     console.log('Response from service:', response);
        //   },
        //   (error) => {
        //     console.error('Error from service:', error);
        //   }
        // );
    }
  }
  
}
