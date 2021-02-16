import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable, of } from 'rxjs';

import { ErrorDialogData } from './error-dialog-data.interface';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
})
export class ErrorDialogComponent {
  public title$: Observable<string> | string;
  public message$: Observable<string> | string;

  constructor(
    private dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData,
  ) {
    this.title$ = data.title instanceof Observable ? data.title : of(data.title);
    this.message$ = data.message instanceof Observable ? data.message : of(data.message);
  }

}