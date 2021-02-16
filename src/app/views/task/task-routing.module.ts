import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskListPageComponent } from './task-list-page/task-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: TaskListPageComponent,
    data: {
	  title: 'tasks',
      animation: 'TaskListPage',
    },
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TaskRoutingModule { }
