import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Crop } from '../../../../models/crop.model';
import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-crop-list-item',
  templateUrl: './crop-list-item.component.html',
})
export class CropListItemComponent implements OnInit {
  @Input() public crop: Crop;

  constructor() { }

  public ngOnInit(): void {
    
  }

  public get lastDoneTask$(): Observable<Task> {
    return this.crop.tasks$.pipe(
      map(tasks => tasks.filter(task => task.done)),
      map(tasks => tasks.shift()),
    );
  }

  public get firstTodoTask$(): Observable<Task> {
    return this.crop.tasks$.pipe(
      map(tasks => tasks.filter(task => !task.done)),
      map(tasks => tasks.pop()),
    );
  }

}