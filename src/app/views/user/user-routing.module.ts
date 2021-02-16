import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedGuard } from '../../guards/logged.guard';
import { NotLoggedGuard } from '../../guards/not-logged.guard';
import { FarmNotChosenGuard } from '../../guards/farm-not-chosen.guard';
import { LoginPageComponent } from './login-page/login-page.component';
import { LogoutPageComponent } from './logout-page/logout-page.component';
import { ChooseFarmPageComponent } from './choose-farm-page/choose-farm-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [NotLoggedGuard],
    data: {
	  title: 'login',
      animation: 'LoginPage',
    },
  },
  {
    path: 'logout',
    component: LogoutPageComponent,
    canActivate: [LoggedGuard],
    data: {
	  title: 'logout',
	  animation: 'LogoutPage',
   },
  },
  {
    path: 'choose-farm',
    component: ChooseFarmPageComponent,
    canActivate: [LoggedGuard, FarmNotChosenGuard],
    data: {
	  title: 'farms',
      animation: 'ChooseFarmPage',
    },
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class UserRoutingModule { }
