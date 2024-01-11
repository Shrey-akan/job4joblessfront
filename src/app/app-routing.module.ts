import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FindjobComponent } from './findjob/findjob.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServiceComponent } from './service/service.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EmployerModule } from './employer/employer.module';
import { CheckotpComponent } from './checkotp/checkotp.component';
import { ResetpassComponent } from './resetpass/resetpass.component';
import { CheckotpuserComponent } from './checkotpuser/checkotpuser.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { Job4joblesspComponent } from './job4joblessp/job4joblessp.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { authGuard } from './auth.guard';
import { FinjobpageComponent } from './finjobpage/finjobpage.component';
import { FindjobuComponent } from './dashboarduser/findjobu/findjobu.component';
import { PolicypageComponent } from './policypage/policypage.component';

const routes: Routes = [
  {
    path: '', component: FindjobComponent
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'about', component: AboutComponent
  },
  { path: 'finjobpage/:locationjob', component: FinjobpageComponent },

  
  { path: 'finjobpage', component: FinjobpageComponent , pathMatch: 'full' },
  {
    path: 'contact', component: ContactComponent
  },
  {
    path: 'checkotp/:uid', component: CheckotpComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'employer',
    loadChildren: () => import('./employer/employer.module').then(m => m.EmployerModule)
  },
  {
    path: 'dashboarduser',
    loadChildren: () => import('./dashboarduser/dashboarduser.module').then(m => m.DashboarduserModule),
    canActivate: [authGuard]
  },
  {
    path:'policypage' , component:PolicypageComponent
  },
  {
    path: 'dashboardemp',
    loadChildren: () => import('./dashboardemp/dashboardemp.module').then(m => m.DashboardempModule),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'resetpass', component: ResetpassComponent
  },
  {
    path: 'checkotpuser/:uid', component: CheckotpuserComponent
  },
  {
    path: 'resetpassword', component: ResetpasswordComponent
  },
  {
    path: 'job4joblessp/:id', component: Job4joblesspComponent
  },
  {
    path: '**', // This route will match any URL
    component: PagenotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
