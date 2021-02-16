import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { Observable, of } from 'rxjs';

import { snackbarAnimation } from '../../../animations/snackbar.animation';

@Component({
  selector: 'app-notification-snackbar',
  templateUrl: './notification-snackbar.component.html',
  animations: [ snackbarAnimation ],
})
export class NotificationSnackbarComponent {
  public message$: Observable<string> | string;

  constructor(
    private snackbarRef: MatSnackBarRef<NotificationSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
  ) {
    this.message$ = data.message instanceof Observable ? data.message : of(data.message);
  }

  public dismiss(): void {
    this.snackbarRef.dismiss();
  }

}