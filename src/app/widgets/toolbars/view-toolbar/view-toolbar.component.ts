import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-view-toolbar',
  templateUrl: './view-toolbar.component.html',
})
export class ViewToolbarComponent {
  @Input()  public title: string;
  @Output() public back = new EventEmitter();

  constructor() { }

}