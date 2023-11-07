import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployerComponent } from './employer.component';
import { PostjobComponent } from './postjob/postjob.component';
import { HeaderempComponent } from './headeremp/headeremp.component';
import { FindcvComponent } from './findcv/findcv.component';
import { ProductsComponent } from './products/products.component';
import { ResourcesComponent } from './resources/resources.component';
import { HelpcenterComponent } from './helpcenter/helpcenter.component';
import { AdvancesearchComponent } from './advancesearch/advancesearch.component';
import { EmpsignComponent } from './empsign/empsign.component';
import { EmpregisterComponent } from './empregister/empregister.component';
import { OptverifyComponent } from './optverify/optverify.component';
import { ResetpassComponent } from './resetpass/resetpass.component';
import { CheckotpemployerComponent } from './checkotpemployer/checkotpemployer.component';
import { ResetpasswordemployerComponent } from './resetpasswordemployer/resetpasswordemployer.component';

const routes: Routes = [

  {
    path:'',component:HeaderempComponent,
    children:[
      {
        path:'',component:PostjobComponent
      },
      {
        path:'findcv',component:FindcvComponent
      },
      {
        path:'products',component:ProductsComponent
      },
      {
        path:'resources',component:ResourcesComponent
      },
      {
        path:'helpcenter',component:HelpcenterComponent
      },
      {
        path:'optverify/:empid',component:OptverifyComponent
      },
      {
        path:'advancesearch',component:AdvancesearchComponent
      },
      {
        path:'empsign',component:EmpsignComponent
      },
      {
        path:'empregister',component:EmpregisterComponent
      },
      {
        path:'resetpass',component:ResetpassComponent
      },
      {
        path:'checkotpemployer/:empid' , component:CheckotpemployerComponent
      },
      {
        path:'resetpasswordemployer' , component:ResetpasswordemployerComponent
      }
    ]
  },
  {
    path: 'dashboardemp',
    loadChildren: () => import('../dashboardemp/dashboardemp.module').then(m => m.DashboardempModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
