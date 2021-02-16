import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { Observable } from 'rxjs';

import { Task } from '../../../../models/task.model';
import { Crop } from '../../../../models/crop.model';
import { CropStore } from '../../../../stores/crop-store.service';

@Component({
  selector: 'app-task-list-action-sheet',
  templateUrl: './task-list-action-sheet.component.html',
})
export class TaskListActionSheetComponent implements OnInit {
  public crop$: Observable<Crop>;

  constructor(
    public bottomSheetRef: MatBottomSheetRef<TaskListActionSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public task: Task,
    private cropStore: CropStore,
  ) { }

  public ngOnInit(): void {
    this.crop$ = this.cropStore.read(this.task.crop_id);
  }

}