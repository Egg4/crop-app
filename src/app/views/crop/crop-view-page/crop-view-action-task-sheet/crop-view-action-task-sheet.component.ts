import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-crop-view-action-task-sheet',
  templateUrl: './crop-view-action-task-sheet.component.html',
})
export class CropViewActionTaskSheetComponent implements OnInit {

  constructor(
    public bottomSheetRef: MatBottomSheetRef<CropViewActionTaskSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public task: Task,
  ) { }

  public ngOnInit(): void {

  }

}