import { NgModule } from '@angular/core';
 
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from '@angular/material/bottom-sheet';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { SharedModule } from '../shared/shared.module';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { LoaderComponent } from './loader/loader.component';
import { NotificationSnackbarComponent } from './snackbars/notification-snackbar/notification-snackbar.component';
import { ListToolbarComponent } from './toolbars/list-toolbar/list-toolbar.component';
import { ViewToolbarComponent } from './toolbars/view-toolbar/view-toolbar.component';
import { FormToolbarComponent } from './toolbars/form-toolbar/form-toolbar.component';

@NgModule({
  declarations: [
	ErrorDialogComponent,
    ConfirmDialogComponent,
	LoaderComponent,
    NotificationSnackbarComponent,
    ListToolbarComponent,
    ViewToolbarComponent,
    FormToolbarComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
	LoaderComponent,
	ListToolbarComponent,
    ViewToolbarComponent,
	FormToolbarComponent,
  ],
  providers: [
    { provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 1500 } },
  ],
})
export class WidgetsModule { }
