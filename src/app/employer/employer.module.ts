import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerRoutingModule } from './employer-routing.module';
import { EmployerComponent } from './employer.component';
import { HeaderempComponent } from './headeremp/headeremp.component';
import { PostjobComponent } from './postjob/postjob.component';
import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
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
import { FootercComponent } from './footerc/footerc.component';

@NgModule({
  declarations: [
    EmployerComponent,
    HeaderempComponent,
    PostjobComponent,
    FindcvComponent,
    ProductsComponent,
    ResourcesComponent,
    HelpcenterComponent,
    AdvancesearchComponent,
    EmpsignComponent,
    EmpregisterComponent,
    OptverifyComponent,
    ResetpassComponent,
    CheckotpemployerComponent,
    ResetpasswordemployerComponent,
    FootercComponent
  ],
  imports: [
    CommonModule,
    EmployerRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  bootstrap:[
    EmployerComponent
  ]
})
export class EmployerModule { }
