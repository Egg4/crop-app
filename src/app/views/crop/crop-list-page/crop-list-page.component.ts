import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { Observable, combineLatest } from 'rxjs';
import { tap, map, filter, mergeMap } from 'rxjs/operators';

import { listAnimation } from '../../../animations/list.animation';
import { listItemAnimation } from '../../../animations/list-item.animation';
import { Crop } from '../../../models/crop.model';
import { CropStore } from '../../../stores/crop-store.service';
import { CropListActionSheetComponent } from './crop-list-action-sheet/crop-list-action-sheet.component';
import { CropFormDialogComponent } from '../crop-form-dialog/crop-form-dialog.component';
import { FormDialogConfig } from '../../../widgets/dialogs/form-dialog/form-dialog-config';
import { ConfirmDialogService } from '../../../widgets/dialogs/confirm-dialog/confirm-dialog.service';
import { NotificationSnackbarService } from '../../../widgets/snackbars/notification-snackbar/notification-snackbar.service';

@Component({
  selector: 'app-crop-list-page',
  templateUrl: './crop-list-page.component.html',
  animations: [ listAnimation, listItemAnimation ],
})
export class CropListPageComponent implements OnInit {
  public crops$: Observable<Crop[]>;

  constructor(
	private router: Router,
	private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private translate: TranslateService,
    private confirmDialog: ConfirmDialogService,
	private snackbar: NotificationSnackbarService,
	private cropStore: CropStore,
  ) { }

  public ngOnInit(): void {
	this.crops$ = this.cropStore.list().pipe(
      mergeMap(crops => combineLatest(
        crops.map(crop => crop.name$.pipe(
	      map(name => Object.assign(crop, { _name: name })),
        ))
      )),
      map(crops => crops.sort((a, b) => {
        const nameA = a._name.removeDiacritics();
        const nameB = b._name.removeDiacritics();
        if (nameA === nameB) return 0;
        return nameA > nameB ? 1 : -1;
      })),
	);
  }

  public onAddClick(): void {
    this.dialog.open(CropFormDialogComponent, new FormDialogConfig()
    ).afterClosed().pipe(
      filter(crop => crop !== undefined),
	  tap(crop => {
		const message$ = crop.name$.pipe(
          mergeMap(name => this.translate.get('crop_list_page.crop_x_created', { name: name }))
        );
		this.snackbar.open(message$);
        this.ngOnInit();
      }),
    ).subscribe();
  }

  public onItemClick(crop: Crop): void {
	this.router.navigate([`/crop/${ crop.id }`]);
  }

  public onItemPress(crop: Crop): void {
	this.bottomSheet.open(CropListActionSheetComponent, {
      data: crop
    }).afterDismissed().pipe(
      filter(action => action !== undefined),
      mergeMap(action => {
        switch (action) {
          case 'update': return this.updateAction(crop);
          case 'delete': return this.deleteAction(crop);
        }
      }),
    ).subscribe();
  }

  private updateAction(crop: Crop): Observable<boolean> {
	return this.dialog.open(CropFormDialogComponent, new FormDialogConfig({
	  data: crop,
    })).afterClosed().pipe(
      filter(crop => crop !== undefined),
	  tap(crop => {
        const message$ = crop.name$.pipe(
          mergeMap(name => this.translate.get('crop_list_page.crop_x_updated', { name: name }))
        );
		this.snackbar.open(message$);
        this.ngOnInit();
      }),
    );
  }

  private deleteAction(crop: Crop): Observable<void> {
    return this.openConfirmDialog(crop).pipe(
      filter(result => result === true),
      mergeMap(_ => this.cropStore.delete(crop.id)),
      tap(_ => {
	    const message$ = crop.name$.pipe(
          mergeMap(name => this.translate.get('crop_list_page.crop_x_deleted', { name: name }))
        );
		this.snackbar.open(message$);
        this.ngOnInit();
      }),
    );
  }

  private openConfirmDialog(crop: Crop): Observable<boolean> {
	return crop.name$.pipe(
	  mergeMap(name => this.confirmDialog.open({
        title: this.translate.get('delete_dialog.title', { name: name }),
        message: this.translate.get('delete_dialog.message', { name: name }),
      }).afterClosed())
    );
  }

}