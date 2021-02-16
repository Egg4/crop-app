import { NgModule } from '@angular/core';

import { TaskRoutingModule } from './task-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { WidgetsModule } from '../../widgets/widgets.module';
import { TaskListPageComponent } from './task-list-page/task-list-page.component';
import { TaskListActionSheetComponent } from './task-list-page/task-list-action-sheet/task-list-action-sheet.component';
import { TaskListItemComponent } from './task-list-page/task-list-item/task-list-item.component';
import { TaskFormDialogComponent } from './task-form-dialog/task-form-dialog.component';
import { TaskPaneComponent } from './task-form-dialog/task-pane/task-pane.component';
import { TaskFormComponent } from './task-form-dialog/task-form/task-form.component';
import { WorkingPaneComponent } from './task-form-dialog/working-pane/working-pane.component';
import { WorkingFormComponent } from './task-form-dialog/working-form/working-form.component';
import { SeedingPaneComponent } from './task-form-dialog/seeding-pane/seeding-pane.component';
import { SeedingFormComponent } from './task-form-dialog/seeding-form/seeding-form.component';
import { PlantingPaneComponent } from './task-form-dialog/planting-pane/planting-pane.component';
import { PlantingFormComponent } from './task-form-dialog/planting-form/planting-form.component';
import { HarvestingPaneComponent } from './task-form-dialog/harvesting-pane/harvesting-pane.component';
import { HarvestingFormComponent } from './task-form-dialog/harvesting-form/harvesting-form.component';

@NgModule({
  declarations: [
    TaskListPageComponent,
    TaskListActionSheetComponent,
    TaskListItemComponent,
    TaskFormDialogComponent,
    TaskPaneComponent,
    TaskFormComponent,
    WorkingPaneComponent,
    WorkingFormComponent,
    SeedingPaneComponent,
    SeedingFormComponent,
    PlantingPaneComponent,
    PlantingFormComponent,
    HarvestingPaneComponent,
    HarvestingFormComponent,
  ],
  imports: [
    TaskRoutingModule,
    SharedModule,
    WidgetsModule,
  ]
})
export class TaskModule { }
