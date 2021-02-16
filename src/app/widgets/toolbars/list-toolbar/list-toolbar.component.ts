import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-toolbar',
  templateUrl: './list-toolbar.component.html',
})
export class ListToolbarComponent {
  @Input()  public title: string;

  constructor() { }

}