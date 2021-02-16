import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { Observable, combineLatest } from 'rxjs';
import { tap, map, filter, mergeMap } from 'rxjs/operators';

import { listAnimation } from '../../../animations/list.animation';
import { listItemAnimation } from '../../../animations/list-item.animation';
import { Variety } from '../../../models/variety.model';
import { VarietyStore } from '../../../stores/variety-store.service';
import { Plant } from '../../../models/plant.model';
import { PlantStore } from '../../../stores/plant-store.service';
import { VarietyListActionSheetComponent } from './variety-list-action-sheet/variety-list-action-sheet.component';
import { VarietyFormDialogComponent } from '../variety-form-dialog/variety-form-dialog.component';
import { FormDialogConfig } from '../../../widgets/dialogs/form-dialog/form-dialog-config';
import { ConfirmDialogService } from '../../../widgets/dialogs/confirm-dialog/confirm-dialog.service';
import { NotificationSnackbarService } from '../../../widgets/snackbars/notification-snackbar/notification-snackbar.service';

@Component({
  selector: 'app-variety-list-page',
  templateUrl: './variety-list-page.component.html',
  animations: [ listAnimation, listItemAnimation ],
})
export class VarietyListPageComponent implements OnInit {
  public plants$: Observable<Plant[]>;

  constructor(
	private bottomSheet: MatBottomSheet,
	private dialog: MatDialog,
	private translate: TranslateService,
    private confirmDialog: ConfirmDialogService,
    private snackbar: NotificationSnackbarService,
	private varietyStore: VarietyStore,
    private plantStore: PlantStore,
  ) { }

  public ngOnInit(): void {
	this.plants$ = this.varietyStore.list().pipe(
      mergeMap(varieties => combineLatest(
        varieties.map(variety => this.plantStore.read(variety.plant_id))
      ).pipe(
        map(plants => Array.from(new Set(plants.map(plant => plant.id))).map(
          id => plants.find(plant => plant.id === id))
        ),
        map(plants => plants.sort(Plant.compare)),
      )),
    );
  }

  public getPlantVarieties(plant: Plant): Observable<Variety[]> {
    return this.varietyStore.list().pipe(
      map(varieties => varieties.filter(variety => variety.plant_id === plant.id)),
    );
  }

  public onAddClick(): void {
    this.dialog.open(VarietyFormDialogComponent, new FormDialogConfig()
    ).afterClosed().pipe(
      filter(variety => variety !== undefined),
	  tap(variety => {
        const message$ = this.translate.get('variety_list_page.variety_x_created', { name: variety.name });
        this.snackbar.open(message$);
        this.ngOnInit();
      }),
    ).subscribe();
  }

  public onItemPress(variety: Variety): void {
	this.bottomSheet.open(VarietyListActionSheetComponent, {
      data: variety
    }).afterDismissed().pipe(
      filter(action => action !== undefined),
      mergeMap(action => {
        switch (action) {
          case 'update': return this.updateAction(variety);
          case 'delete': return this.deleteAction(variety);
        }
      }),
    ).subscribe();
  }

  private updateAction(variety: Variety): Observable<boolean> {
    return this.dialog.open(VarietyFormDialogComponent, new FormDialogConfig({
	  data: variety,
    })).afterClosed().pipe(
      filter(variety => variety !== undefined),
	  tap(variety => {
        const message$ = this.translate.get('variety_list_page.variety_x_updated', { name: variety.name });
        this.snackbar.open(message$);
        this.ngOnInit();
      }),
    );
  }

  private deleteAction(variety: Variety): Observable<void> {
    return this.openConfirmDialog(variety).pipe(
      filter(result => result === true),
      mergeMap(_ => this.varietyStore.delete(variety.id)),
      tap(_ => {
        const message$ = this.translate.get('variety_list_page.variety_x_deleted', { name: variety.name });
        this.snackbar.open(message$);
        this.ngOnInit();
      }),
    );
  }

  private openConfirmDialog(variety: Variety): Observable<boolean> {
	return variety.plant$.pipe(
	  mergeMap(plant => this.confirmDialog.open({
        title: this.translate.get('delete_dialog.title', { name: `${ plant.name } ${ variety.name }` }),
        message: this.translate.get('delete_dialog.message', { name: `${ plant.name } ${ variety.name }` }),
      }).afterClosed())
    );
  }

}