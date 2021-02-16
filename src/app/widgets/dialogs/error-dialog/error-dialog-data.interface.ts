import { Observable } from 'rxjs';

export interface ErrorDialogData {
  title: Observable<string> | string;
  message: Observable<string> | string;
}