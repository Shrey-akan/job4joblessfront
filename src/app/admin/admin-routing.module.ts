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
import { authGuard } from '../auth.guard';
import { SubadminComponent } from './subadmin/subadmin.component';
import { PushnotificationComponent } from './pushnotification/pushnotification.component';
import { BlogsComponent } from './blogs/blogs.component';
import { SubadmindetailsComponent } from './subadmindetails/subadmindetails.component';
import { UpdatesubadminComponent } from './updatesubadmin/updatesubadmin.component';
import { AdminloginComponent } from '../adminlogin/adminlogin.component';
import { InfoPageComponent } from './info-page/info-page.component';

const routes: Routes = [

   {
    path: '', component: DashboardadminComponent,
    canActivate: [authGuard], 
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
        path:'adminlogin' , component:AdminloginComponent
      },
      {
        path: 'jobprovided', component: JobprovidedComponent
      },
      {
        path: 'subadmin', component: SubadminComponent
      },
      {
        path: 'pushnotification', component: PushnotificationComponent
      },
      {
        path: 'blogs', component: BlogsComponent
      },
      {
        path: 'notify/:userId', component: NotifyComponent
      },
      {
        path: 'profile', component: ProfileComponent
      },
      {
        path: 'subadmindetails', component: SubadmindetailsComponent
      },
      {
        path: 'infoPage', component: InfoPageComponent
      },
      {
        path: 'enquirydetails', component: EnquirydetailsComponent
      },
      {
        path: 'updatesubadmin/:id', component: UpdatesubadminComponent
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
