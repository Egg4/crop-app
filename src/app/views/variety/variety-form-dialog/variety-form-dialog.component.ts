import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Variety } from '../../../models/variety.model';
import { Plant } from '../../../models/plant.model';
import { VarietyStore } from '../../../stores/variety-store.service';
import { PlantStore } from '../../../stores/plant-store.service';

@Component({
  selector: 'app-variety-form-dialog',
  templateUrl: './variety-form-dialog.component.html',
})
export class VarietyFormDialogComponent implements OnInit {
  private submitted: boolean = false;
  public submittable: boolean;
  public title$: Observable<string>;
  public allPlants$: Observable<Plant[]>;

  public form = this.formBuilder.group({
    id: [],
    plant_id: ['', [
	  Validators.required,
	]],
    name: ['', [
	  Validators.required,
	]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public variety: Variety,
    private dialogRef: MatDialogRef<VarietyFormDialogComponent>,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private varietyStore: VarietyStore,
	private plantStore: PlantStore,
  ) { }

  public ngOnInit(): void {
	if (this.variety) {
      this.populate(this.variety);
      this.title$ = this.variety.plant$.pipe(
        map(plant => `${ plant.name } ${ this.variety.name }`)
      );
	}
	else {
      this.title$ = this.translate.get(['create', 'variety']).pipe(
	    map(t => (`${ t.create } ${ t.variety }`).upperCaseFirst())
      );
	}
	this.allPlants$ = this.plantStore.list();

	this.form.valueChanges.subscribe(
      _ => this.submittable = this.isSubmittable()
    );
  }

  private populate(variety: Variety): void {
    this.form.setValue({
      id: variety.id,
      plant_id: variety.plant_id,
      name: variety.name,
    });
  }

  public get new(): boolean {
	return !+this.form.get('id').value;
  }

  public isSubmittable(): boolean {
    return !this.submitted && this.form.valid && (this.form.dirty || this.new);
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }

  public onSaveClick(): void {
	this.submitted = true;
	const variety = this.form.value;
    const variety$ = this.new ? this.varietyStore.create(variety) : this.varietyStore.update(variety);
    variety$.subscribe(
      variety => this.dialogRef.close(variety)
    );
  }

}
