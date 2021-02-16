import { NgModule } from '@angular/core';

import { VarietyRoutingModule } from './variety-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { WidgetsModule } from '../../widgets/widgets.module';
import { VarietyListPageComponent } from './variety-list-page/variety-list-page.component';
import { VarietyListActionSheetComponent } from './variety-list-page/variety-list-action-sheet/variety-list-action-sheet.component';
import { VarietyFormDialogComponent } from './variety-form-dialog/variety-form-dialog.component';

@NgModule({
  declarations: [
    VarietyListPageComponent,
    VarietyListActionSheetComponent,
    VarietyFormDialogComponent,
  ],
  imports: [
    VarietyRoutingModule,
    SharedModule,
    WidgetsModule,
  ]
})
export class VarietyModule { }