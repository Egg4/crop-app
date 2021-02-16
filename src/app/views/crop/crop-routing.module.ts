import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CropListPageComponent } from './crop-list-page/crop-list-page.component';
import { CropViewPageComponent } from './crop-view-page/crop-view-page.component';

const routes: Routes = [
  {
    path: '',
    component: CropListPageComponent,
    data: {
	  title: 'crops',
      animation: 'CropListPage',
    },
  },
  {
    path: ':id',
    component: CropViewPageComponent,
    data: {
	  title: 'crop',
      animation: 'CropViewPage',
    },
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CropRoutingModule { }
