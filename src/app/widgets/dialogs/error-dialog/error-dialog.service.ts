import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ErrorDialogComponent } from './error-dialog.component';
import { ErrorDialogData } from './error-dialog-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {

  constructor(
    private dialog: MatDialog,
  ) { }

  public open(data: ErrorDialogData): MatDialogRef<any>  {
    return this.dialog.open(ErrorDialogComponent, {
      data: data,
    });
  }

}