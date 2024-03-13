import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import { LoginadminComponent } from './loginadmin/loginadmin.component';
import { DashboardadminComponent } from './dashboardadmin/dashboardadmin.component';
import { UserdetailsComponent } from './userdetails/userdetails.component';
import { EmployerdetailsComponent } from './employerdetails/employerdetails.component';
import { JobprovidedComponent } from './jobprovided/jobprovided.component';
import { ProfileComponent } from './profile/profile.component';
import { EnquirydetailsComponent } from './enquirydetails/enquirydetails.component';
import { DashhomeComponent } from './dashhome/dashhome.component';
import { NotifyComponent } from './notify/notify.component';
import { QuestionComponent } from './question/question.component';


@NgModule({
  declarations: [
    AdminComponent,

    LoginadminComponent,
     DashboardadminComponent,
     UserdetailsComponent,
     EmployerdetailsComponent,
     JobprovidedComponent,
     ProfileComponent,
     EnquirydetailsComponent,
     DashhomeComponent,
     NotifyComponent,
     QuestionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ],
  bootstrap:[
    AdminComponent
  ]
})
export class AdminModule { }
