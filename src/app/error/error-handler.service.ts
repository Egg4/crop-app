import { Injectable, ErrorHandler } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';

import { ErrorDialogService } from '../widgets/dialogs/error-dialog/error-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService extends ErrorHandler {

  constructor(
	private translate: TranslateService,
    private errorDialog: ErrorDialogService,
  ) {
    super();
  }

  public handleError(error: Error): void {
    if (error.name === 'network_error') {
	  this.openErrorDialog(error.name);
    }

    super.handleError(error);
  }

  private openErrorDialog(errorName: string): Observable<boolean> {
	return this.errorDialog.open({
      title: this.translate.get(`errors.${ errorName }.title`),
      message: this.translate.get(`errors.${ errorName }.message`),
    }).afterClosed();
  }

}