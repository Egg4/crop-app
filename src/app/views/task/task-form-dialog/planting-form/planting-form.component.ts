import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';
import { map, startWith, pairwise, mergeMap, filter, tap } from 'rxjs/operators';

import { Planting } from '../../../../models/planting.model';
import { Variety } from '../../../../models/variety.model';
import { VarietyStore } from '../../../../stores/variety-store.service';
import { VarietyListHandler } from '../variety-list-handler.service';
import { VarietyFormDialogComponent } from '../../../variety/variety-form-dialog/variety-form-dialog.component';
import { FormDialogConfig } from '../../../../widgets/dialogs/form-dialog/form-dialog-config';
import { NotificationSnackbarService } from '../../../../widgets/snackbars/notification-snackbar/notification-snackbar.service';

@Component({
  selector: 'app-planting-form',
  templateUrl: './planting-form.component.html',
})
export class PlantingFormComponent implements OnInit, OnDestroy {
  @Input() public planting: Planting;
  @Output() public formChange = new EventEmitter();

  public computeQuantity: boolean;
  private _varieties$: Observable<Variety[]>;
  public rowSpacings = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
    { value: 25, label: '25' },
    { value: 30, label: '30' },
    { value: 40, label: '40' },
    { value: 50, label: '50' },
    { value: 60, label: '60' },
    { value: 70, label: '70' },
    { value: 80, label: '80' },
    { value: 100, label: '100' },
    { value: 120, label: '120' },
  ];
  public form = this.formBuilder.group({
    id: [],
    task_id: [],
    variety_id: ['', [
	  Validators.required,
	]],
	intra_row_spacing: ['', [
	  Validators.required,
	]],
	inter_row_spacing: ['', [
	  Validators.required,
	]],
	quantity: ['', [
	  Validators.required,
	]],
	area: [{ value: '', disabled:true }, [
	  Validators.required,
	]],
  });

  constructor(
    private formBuilder: FormBuilder,
	private dialog: MatDialog,
	private translate: TranslateService,
	private snackbar: NotificationSnackbarService,
    private varietyStore: VarietyStore,
    private varietyListHandler: VarietyListHandler,
  ) { }

  public ngOnInit(): void {
    this.populate(this.planting);
    this.subscribeVarietyIdChanges();
    this.subscribeFormChanges();
  }

  private populate(planting: Planting): void {
    this.form.setValue({
      id: planting.id,
      task_id: planting.task_id,
      variety_id: planting.variety_id,
      intra_row_spacing: planting.intra_row_spacing,
      inter_row_spacing: planting.inter_row_spacing,
      quantity: planting.quantity,
      area: Math.round(planting.quantity * planting.intra_row_spacing /100 * planting.inter_row_spacing / 100) || null,
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
    this.form.valueChanges.subscribe(_ => {

      const intra_row_spacing = this.form.get('intra_row_spacing').value;
      const inter_row_spacing = this.form.get('inter_row_spacing').value;
      if (this.computeQuantity) {
	    const area = this.form.get('area').value;
        if (intra_row_spacing && inter_row_spacing && area) {
          const quantity = Math.round(area / (intra_row_spacing / 100 * inter_row_spacing / 100));
          if (quantity !== this.form.get('quantity').value) {
            this.form.get('quantity').setValue(quantity);
          }
        }
      } else {
	    const quantity = this.form.get('quantity').value;
        if (intra_row_spacing && inter_row_spacing && quantity) {
          const area = Math.round(quantity * intra_row_spacing / 100 * inter_row_spacing / 100);
          if (area !== this.form.get('area').value) {
            this.form.get('area').setValue(area);
          }
        }
      }

      this.formChange.emit();
    });
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

  public toggleCompute(): void {
    this.computeQuantity = !this.computeQuantity;
    if (this.computeQuantity) {
      this.form.get('quantity').disable();
      this.form.get('area').enable();
    }
    else {
	  this.form.get('quantity').enable();
      this.form.get('area').disable();
    }
  }

  public get value(): Planting {
    let planting = this.form.value;
    if (this.computeQuantity) {
	  planting.quantity = this.form.get('quantity').value;
      delete planting.area;
    }
	return planting;
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
