import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-toolbar',
  templateUrl: './form-toolbar.component.html',
})
export class FormToolbarComponent {
  @Input()  public title: string;
  @Input()  public cancelDisabled: boolean;
  @Input()  public saveDisabled: boolean;
  @Output() public cancel = new EventEmitter();
  @Output() public save = new EventEmitter();

  constructor() { }

}