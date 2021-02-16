import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { Variety } from '../../../../models/variety.model';

@Component({
  selector: 'app-variety-list-action-sheet',
  templateUrl: './variety-list-action-sheet.component.html',
})
export class VarietyListActionSheetComponent {

  constructor(
    public bottomSheetRef: MatBottomSheetRef<VarietyListActionSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public variety: Variety,
  ) { }

}