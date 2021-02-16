import { Observable } from 'rxjs';

export interface ConfirmDialogData {
  title: Observable<string> | string;
  message: Observable<string> | string;
}