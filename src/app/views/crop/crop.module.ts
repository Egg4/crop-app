import { NgModule } from '@angular/core';

import { CropRoutingModule } from './crop-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { WidgetsModule } from '../../widgets/widgets.module';
import { CropListPageComponent } from './crop-list-page/crop-list-page.component';
import { CropListItemComponent } from './crop-list-page/crop-list-item/crop-list-item.component';
import { CropListActionSheetComponent } from './crop-list-page/crop-list-action-sheet/crop-list-action-sheet.component';
import { CropViewPageComponent } from './crop-view-page/crop-view-page.component';
import { CropViewAddTaskSheetComponent } from './crop-view-page/crop-view-add-task-sheet/crop-view-add-task-sheet.component';
import { CropViewActionTaskSheetComponent } from './crop-view-page/crop-view-action-task-sheet/crop-view-action-task-sheet.component';
import { CropFormDialogComponent } from './crop-form-dialog/crop-form-dialog.component';

@NgModule({
  declarations: [
    CropListPageComponent,
    CropListItemComponent,
    CropListActionSheetComponent,
    CropViewPageComponent,
    CropViewAddTaskSheetComponent,
    CropViewActionTaskSheetComponent,
    CropFormDialogComponent,
  ],
  imports: [
    CropRoutingModule,
    SharedModule,
    WidgetsModule,
  ]
})
export class CropModule { }
