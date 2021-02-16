import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VarietyListPageComponent } from './variety-list-page/variety-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: VarietyListPageComponent,
    data: {
      title: 'varieties',
      animation: 'VarietyListPage',
    },
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class VarietyRoutingModule { }
