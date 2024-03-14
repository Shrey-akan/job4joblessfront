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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SubadminComponent } from './subadmin/subadmin.component';
import { PushnotificationComponent } from './pushnotification/pushnotification.component';
import { BlogsComponent } from './blogs/blogs.component';
import { SubadmindetailsComponent } from './subadmindetails/subadmindetails.component';
import { MatTableModule } from '@angular/material/table';
import { UpdatesubadminComponent } from './updatesubadmin/updatesubadmin.component';
import { InfoPageComponent } from './info-page/info-page.component';
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
     QuestionComponent,
     SubadminComponent,
     PushnotificationComponent,
     BlogsComponent,
     SubadmindetailsComponent,
     UpdatesubadminComponent,
     InfoPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule
  ],
  bootstrap:[
    AdminComponent
  ]
})
export class AdminModule { }
