import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';
import { map, startWith, pairwise, mergeMap, filter, tap } from 'rxjs/operators';

import { Seeding } from '../../../../models/seeding.model';
import { Crop } from '../../../../models/crop.model';
import { Variety } from '../../../../models/variety.model';
import { CropStore } from '../../../../stores/crop-store.service';
import { VarietyStore } from '../../../../stores/variety-store.service';
import { VarietyListHandler } from '../variety-list-handler.service';
import { VarietyFormDialogComponent } from '../../../variety/variety-form-dialog/variety-form-dialog.component';
import { FormDialogConfig } from '../../../../widgets/dialogs/form-dialog/form-dialog-config';
import { NotificationSnackbarService } from '../../../../widgets/snackbars/notification-snackbar/notification-snackbar.service';

@Component({
  selector: 'app-seeding-form',
  templateUrl: './seeding-form.component.html',
})
export class SeedingFormComponent implements OnInit, OnDestroy {
  @Input() public seeding: Seeding;
  @Input() public cropId: number;
  @Output() public formChange = new EventEmitter();

  public crop$: Observable<Crop>;
  private _varieties$: Observable<Variety[]>;
  public directSeedingModes = ['drilling', 'broadcasting'];
  public nurserySeedingModes = ['pluging'];
  public form = this.formBuilder.group({
    id: [],
    task_id: [],
    variety_id: ['', [
	  Validators.required,
	]],
	mode: ['', [
	  Validators.required,
	]],
	density: ['', [
	  Validators.required,
	]],
	area: ['', [
	  Validators.required,
	]],
	unit: ['', [
	  Validators.required,
	]],
  });

  constructor(
    private formBuilder: FormBuilder,
	private dialog: MatDialog,
	private translate: TranslateService,
	private snackbar: NotificationSnackbarService,
    private cropStore: CropStore,
    private varietyStore: VarietyStore,
    private varietyListHandler: VarietyListHandler,
  ) { }

  public ngOnInit(): void {
    this.populate(this.seeding);
    this.crop$ = this.cropStore.read(this.cropId).pipe(
      tap(crop => {
        const unit = crop.mode === 'direct_seeding' ? 'g/m²' : 'seed/plug';
        this.form.get('unit').setValue(unit, { emitEvent:false });
      })
    );
    this.subscribeVarietyIdChanges();
    this.subscribeFormChanges();
  }

  private populate(seeding: Seeding): void {
    this.form.setValue({
      id: seeding.id,
      task_id: seeding.task_id,
      variety_id: seeding.variety_id,
      mode: seeding.mode,
      density: seeding.density,
      area: seeding.area,
      unit: seeding.unit,
    });
  }

  private subscribeVarietyIdChanges(): void {
    const varietyId = this.form.get('variety_id').value;
    if (varietyId) this.varietyListHandler.hold(varietyId);

    this.form.get('variety_id').valueChanges.pipe(
      startWith(varietyId),
      pairwise()
    ).subscribe(([previousVarietyId, nextVarietyId]: [number, number]) => {
      if (previousVarietyId) this.varietyListHandler.release(previousVarietyId);
      if (nextVarietyId) this.varietyListHandler.hold(nextVarietyId);
      if (previousVarietyId || nextVarietyId) this.varietyListHandler.updateAvailables();
    });
  }

  private subscribeFormChanges(): void {
    this.form.valueChanges.subscribe(_ => this.formChange.emit());
  }

  public get varieties$(): Observable<Variety[]> {
    if (!this._varieties$) {
      this._varieties$ = this.varietyListHandler.availables$.pipe(
        mergeMap(varieties => {
	      const varietyId = this.form.get('variety_id').value;
          if (!varietyId) return of(varieties);
          return this.varietyStore.read(varietyId).pipe(
            map(variety => [...varieties, variety]),
            map(varieties => varieties.sort(Variety.compare)),
          )
        })
      );
    }
	return this._varieties$;
  }

  public get value(): Seeding {
	return this.form.value;
  }

  public onAddVariety(): void {
    this.dialog.open(VarietyFormDialogComponent, new FormDialogConfig()).afterClosed().pipe(
      filter(variety => variety !== undefined),
	  tap(variety => {
        const message$ = this.translate.get('task_from_dialog.variety_x_created', { name: variety.name });
        this.snackbar.open(message$);
        this.varietyListHandler.updateList();
        this.form.get('variety_id').setValue(variety.id);
      }),
    ).subscribe();
  }

  public ngOnDestroy(): void {
    this._varieties$ = null;
    const varietyId = this.form.get('variety_id').value;
    if (varietyId) this.varietyListHandler.release(varietyId);
    this.varietyListHandler.updateAvailables();
  }

}
