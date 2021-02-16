import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Task } from '../../../../models/task.model';
import { Crop } from '../../../../models/crop.model';
import { CropStore } from '../../../../stores/crop-store.service';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
})
export class TaskListItemComponent implements OnInit {
  @Input() public task: Task;
  public crop$: Observable<Crop>;

  constructor(
    private cropStore: CropStore,
  ) { }

  public ngOnInit(): void {
    this.crop$ = this.cropStore.read(this.task.crop_id);
  }

}
