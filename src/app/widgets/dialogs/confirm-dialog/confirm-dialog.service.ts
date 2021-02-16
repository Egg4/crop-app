import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogData } from './confirm-dialog-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(
    private dialog: MatDialog,
  ) { }

  public open(data: ConfirmDialogData): MatDialogRef<any>  {
    return this.dialog.open(ConfirmDialogComponent, {
      data: data,
    });
  }

}