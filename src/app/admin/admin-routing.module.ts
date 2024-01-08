import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { LoginadminComponent } from './loginadmin/loginadmin.component';
import { DashboardadminComponent } from './dashboardadmin/dashboardadmin.component';
import { DashhomeComponent } from './dashhome/dashhome.component';
import { UserdetailsComponent } from './userdetails/userdetails.component';
import { EmployerdetailsComponent } from './employerdetails/employerdetails.component';
import { JobprovidedComponent } from './jobprovided/jobprovided.component';
import { EnquirydetailsComponent } from './enquirydetails/enquirydetails.component';
import { NotificationComponent } from '../dashboarduser/notification/notification.component';
import { NotifyComponent } from './notify/notify.component';
import { ProfileComponent } from './profile/profile.component';
import { QuestionComponent } from './question/question.component';

const routes: Routes = [
  {
    path: '', component: LoginadminComponent
  }, {
    path: 'dashboardadmin', component: DashboardadminComponent,
    children: [
      {
        path: '', component: DashhomeComponent
      },
      {
        path: 'userdetails', component: UserdetailsComponent
      }, 
      {
        path: 'employerdetails', component: EmployerdetailsComponent
      },
      {
        path: 'jobprovided', component: JobprovidedComponent
      },
      {
        path: 'notify/:userId', component: NotifyComponent
      },
      {
        path: 'profile', component: ProfileComponent
      },

      {
        path: 'enquirydetails', component: EnquirydetailsComponent
      },
      {
        path: 'question', component: QuestionComponent
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
