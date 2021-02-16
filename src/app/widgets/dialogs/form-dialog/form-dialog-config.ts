export class FormDialogConfig {
  panelClass = 'form-dialog-overlay';      
  hasBackdrop = false;
  autoFocus = false;
  restoreFocus = true;
  height = '100%';
  width = '100%';
  maxHeight = '100%';
  maxWidth = '100%';

  constructor(data?: any) {
    if (data) Object.assign(this, data);
  }

}