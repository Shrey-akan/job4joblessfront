import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderuserComponent } from './headeruser/headeruser.component';
import { FindjobuComponent } from './findjobu/findjobu.component';
import { CompanyComponent } from './company/company.component';
import { SalaryComponent } from './salary/salary.component';
import { MessageComponent } from './message/message.component';
import { NotificationComponent } from './notification/notification.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { ApplyjobComponent } from './applyjob/applyjob.component';
import { ResumeComponent } from './resume/resume.component';
import { SettinguserComponent } from './settinguser/settinguser.component';
import { MyjobsComponent } from './myjobs/myjobs.component';
import { QuestionpaperComponent } from './questionpaper/questionpaper.component';
import { UpdateprofileComponent } from './updateprofile/updateprofile.component';
import { VideocallComponent } from './videocall/videocall.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: '', component: HeaderuserComponent,
    canActivate: [authGuard], 
    children: [
      {
        path: '', component: FindjobuComponent
      },
      {
        path: 'company', component: CompanyComponent
      },
      {
        path: 'salary', component: SalaryComponent
      },
      {
        path: 'message', component: MessageComponent
      },
      {
        path: 'notification', component: NotificationComponent
      },
      {
        path: 'userprofile', component: UserprofileComponent
      },
      {
        path: 'updateprofile/:userId', component: UpdateprofileComponent
      },
      {
        path: 'applyjob', component: ApplyjobComponent
      },
      {
        path: 'myjobs', component: MyjobsComponent
      },
      {
        path: 'resume', component: ResumeComponent
      },
      {
        path: 'questionpaper', component: QuestionpaperComponent
      },
      {
        path: 'settinguser', component: SettinguserComponent
      },
      {
        path: 'videocall/:selectedUser', component: VideocallComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboarduserRoutingModule { }
