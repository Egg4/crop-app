import { $, $$, ElementFinder } from 'protractor';

import { Crop } from '../../../src/app/models/crop.model';

export class CropFormDialog {

  public get element(): ElementFinder {
    return $('app-crop-form-dialog');
  }

  public get title(): ElementFinder {
    return this.element.$('mat-toolbar .title');
  }

  public get backButton(): ElementFinder {
    return this.element.$$('mat-toolbar button').get(0);
  }

  public get submitButton(): ElementFinder {
    return this.element.$$('mat-toolbar button').get(1);
  }

  public get overlayBackdrop(): ElementFinder {
    return $('.cdk-overlay-backdrop');
  }

  public get plantSelect(): ElementFinder {
    return this.element.$('mat-select[formControlName="plant_ids"]');
  }

  public plantSelectOption(plant_id: number): ElementFinder {
    return $(`mat-option[ng-reflect-value="${ plant_id }"]`);
  }

  public get numberInput(): ElementFinder {
    return this.element.$('input[formControlName="number"]');
  }

  public get modeRadioGroup(): ElementFinder {
    return this.element.$('mat-radio-group[formControlName="mode"]');
  }

  public modeRadioButton(value: string): ElementFinder {
    return this.modeRadioGroup.$(`mat-radio-button[ng-reflect-value="${ value }"]`);
  }

  public async populate(crop: Crop) {
	await this.plantSelect.click();
    await Promise.all(crop.plant_ids.map(
      plant_id => this.plantSelectOption(plant_id).click(),
    ));
    await this.overlayBackdrop.click(); // close dropdown select
    await this.numberInput.sendKeys(crop.number);
    await this.modeRadioButton(crop.mode).click();
    await this.title.click(); // trigger blur event for asyncValidators
	return Promise.resolve();
  }

}