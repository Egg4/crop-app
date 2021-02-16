import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Crop } from '../../../models/crop.model';
import { Plant } from '../../../models/plant.model';
import { CropStore } from '../../../stores/crop-store.service';
import { PlantStore } from '../../../stores/plant-store.service';
import { CropUnicityValidator } from '../../../validators/crop-unicity.validator';

@Component({
  selector: 'app-crop-form-dialog',
  templateUrl: './crop-form-dialog.component.html',
})
export class CropFormDialogComponent implements OnInit {
  private submitted: boolean = false;
  public submittable: boolean;
  public title$: Observable<string>;
  public allPlants$: Observable<Plant[]>;
  public modes = [
	'direct_seeding',
	'nursery_seeding',
    'plant_purchasing',
  ];

  public form = this.formBuilder.group({
    id: [],
    task_ids: [[]],
    plant_ids: [[], [
	  Validators.required,
	]],
    number: ['', [
	  Validators.required,
	]],
    mode: ['direct_seeding', [
	  Validators.required,
	]],
  }, {
    asyncValidators: [this.unicityValidator.validate.bind(this.unicityValidator)],
    updateOn: 'blur',
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public crop: Crop,
    private dialogRef: MatDialogRef<CropFormDialogComponent>,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private unicityValidator: CropUnicityValidator,
    private cropStore: CropStore,
	private plantStore: PlantStore,
  ) { }

  public ngOnInit(): void {
	if (this.crop) {
      this.populate(this.crop)
      this.title$ = this.crop.name$;
	}
	else {
      this.title$ = this.translate.get(['create', 'crop']).pipe(
	    map(t => (`${ t.create } ${ t.crop }`).upperCaseFirst())
      );
	}
	this.allPlants$ = this.plantStore.list();

    this.form.valueChanges.subscribe(
      _ => this.submittable = this.isSubmittable()
    );

    this.form.statusChanges.subscribe(
      _ => this.submittable = this.isSubmittable()
    );
  }

  private populate(crop: Crop): void {
    this.form.setValue({
      id: crop.id,
      number: crop.number,
      mode: crop.mode,
      plant_ids: crop.plant_ids,
      task_ids: crop.task_ids,
    });
  }

  public get new(): boolean {
	return !+this.form.get('id').value;
  }

  public isSubmittable(): boolean {
    return !this.submitted && this.form.valid && (this.form.dirty || this.new);
  }

  public onNumberClick(number: number): void {
    let value = +this.form.get('number').value + number;
    if (value < 1) value = 1;
    this.form.get('number').markAsDirty();
    this.form.get('number').setValue(value);
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }

  public onSaveClick(): void {
	this.submitted = true;
	const crop = this.form.value;
    const crop$ = this.new ? this.cropStore.create(crop) : this.cropStore.update(crop);
    crop$.subscribe(
      crop => this.dialogRef.close(crop)
    );
  }

}