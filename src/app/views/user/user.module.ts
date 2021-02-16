import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { LogoutPageComponent } from './logout-page/logout-page.component';
import { ChooseFarmPageComponent } from './choose-farm-page/choose-farm-page.component';

@NgModule({
  declarations: [
	LoginPageComponent,
	LogoutPageComponent,
	ChooseFarmPageComponent,
  ],
  imports: [
    SharedModule,
    UserRoutingModule,
  ]
})
export class UserModule { }
