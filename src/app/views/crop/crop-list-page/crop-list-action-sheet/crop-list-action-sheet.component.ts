import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { Crop } from '../../../../models/crop.model';

@Component({
  selector: 'app-crop-list-action-sheet',
  templateUrl: './crop-list-action-sheet.component.html',
})
export class CropListActionSheetComponent {

  constructor(
    public bottomSheetRef: MatBottomSheetRef<CropListActionSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public crop: Crop,
  ) { }

}