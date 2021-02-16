import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { Crop } from '../../../../models/crop.model';

@Component({
  selector: 'app-crop-view-add-task-sheet',
  templateUrl: './crop-view-add-task-sheet.component.html',
})
export class CropViewAddTaskSheetComponent {

  constructor(
    public bottomSheetRef: MatBottomSheetRef<CropViewAddTaskSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public crop: Crop,
  ) { }

}