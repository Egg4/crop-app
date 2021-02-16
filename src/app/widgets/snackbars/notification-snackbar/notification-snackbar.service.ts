import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { Observable } from 'rxjs';

import { NotificationSnackbarComponent } from './notification-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationSnackbarService {

  constructor(
    private snackbar: MatSnackBar,
  ) { }

  public open(message: Observable<string> | string): MatSnackBarRef<void>  {
    return this.snackbar.openFromComponent<void>(NotificationSnackbarComponent, {
      data: { message: message },
    });
  }

}