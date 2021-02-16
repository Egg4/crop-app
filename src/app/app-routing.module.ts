import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedGuard } from './guards/logged.guard';
import { FarmChosenGuard } from './guards/farm-chosen.guard';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('./views/user/user.module').then(m => m.UserModule),
  },
  {
    path: 'crop',
    loadChildren: () => import('./views/crop/crop.module').then(m => m.CropModule),
    canActivate: [LoggedGuard, FarmChosenGuard]
  },
  {
    path: 'task',
    loadChildren: () => import('./views/task/task.module').then(m => m.TaskModule),
    canActivate: [LoggedGuard, FarmChosenGuard]
  },
  {
    path: 'variety',
    loadChildren: () => import('./views/variety/variety.module').then(m => m.VarietyModule),
    canActivate: [LoggedGuard, FarmChosenGuard]
  },
  {
    path: '',
    redirectTo: 'crop',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }