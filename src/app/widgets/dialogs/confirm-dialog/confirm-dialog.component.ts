import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable, of } from 'rxjs';

import { ConfirmDialogData } from './confirm-dialog-data.interface';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  public title$: Observable<string> | string;
  public message$: Observable<string> | string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {
    this.title$ = data.title instanceof Observable ? data.title : of(data.title);
    this.message$ = data.message instanceof Observable ? data.message : of(data.message);
  }

}