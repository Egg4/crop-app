import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { tap, filter, mergeMap } from 'rxjs/operators';

import { listAnimation } from '../../../animations/list.animation';
import { listItemAnimation } from '../../../animations/list-item.animation';
import { Crop } from '../../../models/crop.model';
import { Task } from '../../../models/task.model';
import { CropStore } from '../../../stores/crop-store.service';
import { TaskStore } from '../../../stores/task-store.service';
import { CropViewAddTaskSheetComponent } from './crop-view-add-task-sheet/crop-view-add-task-sheet.component';
import { CropViewActionTaskSheetComponent } from './crop-view-action-task-sheet/crop-view-action-task-sheet.component';
import { TaskFormDialogComponent } from '../../task/task-form-dialog/task-form-dialog.component';
import { FormDialogConfig } from '../../../widgets/dialogs/form-dialog/form-dialog-config';
import { ConfirmDialogService } from '../../../widgets/dialogs/confirm-dialog/confirm-dialog.service';
import { NotificationSnackbarService } from '../../../widgets/snackbars/notification-snackbar/notification-snackbar.service';

@Component({
  selector: 'app-crop-view-page',
  templateUrl: './crop-view-page.component.html',
  styleUrls: ['./crop-view-page.component.scss'],
  animations: [ listAnimation, listItemAnimation ],
})
export class CropViewPageComponent implements OnInit {
  public crop$: Observable<Crop>;
  public tasks$: Observable<Task[]>;
  public title$: Observable<string>;

  constructor(
	private route: ActivatedRoute,
	private location: Location,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private translate: TranslateService,
    private confirmDialog: ConfirmDialogService,
    private snackbar: NotificationSnackbarService,
    private cropStore: CropStore,
    private taskStore: TaskStore,
  ) { }

  public ngOnInit(): void {
    const cropId = +this.route.snapshot.paramMap.get('id');
    this.crop$ = this.cropStore.read(cropId);
    this.tasks$ = this.crop$.pipe(mergeMap(crop => crop.tasks$));
    this.title$ = this.crop$.pipe(mergeMap(crop => crop.name$));
  }

  public onBackClick(): void {
    this.location.back();
  }

  public onAddClick(crop: Crop): void {
    this.bottomSheet.open(CropViewAddTaskSheetComponent, {
      data: crop
    }).afterDismissed().pipe(
      filter(action => action !== undefined),
      mergeMap(action => this.addAction(action)),
    ).subscribe();
  }

  private addAction(taskType: string): Observable<Task> {
	const cropId = +this.route.snapshot.paramMap.get('id');
	return this.dialog.open(TaskFormDialogComponent, new FormDialogConfig({
      data: { crop_id: cropId, type: taskType }
	})).afterClosed().pipe(
      filter(task => task !== undefined),
	  tap(task => {
		const message$ = task.name$.pipe(
          mergeMap(name => this.translate.get('crop_view_page.task_x_created', { name: name }))
        );
		this.snackbar.open(message$);
        this.ngOnInit();
      }),
    );
  }

  public onItemPress(task: Task): void {
	this.bottomSheet.open(CropViewActionTaskSheetComponent, {
      data: task
    }).afterDismissed().pipe(
      filter(action => action !== undefined),
      mergeMap(action => {
        switch (action) {
          case 'update': return this.updateAction(task);
          case 'delete': return this.deleteAction(task);
        }
      }),
    ).subscribe();
  }

  private updateAction(task: Task): Observable<boolean> {
	return this.dialog.open(TaskFormDialogComponent, new FormDialogConfig({
	  data: task,
    })).afterClosed().pipe(
      filter(task => task !== undefined),
	  tap(task => {
		const message$ = task.name$.pipe(
          mergeMap(name => this.translate.get('crop_view_page.task_x_updated', { name: name }))
        );
		this.snackbar.open(message$);
        this.ngOnInit();
      }),
    );
  }

  private deleteAction(task: Task): Observable<void> {
	return this.openConfirmDialog(task).pipe(
      filter(result => result === true),
      mergeMap(_ => this.taskStore.delete(task.id)),
      tap(_ => {
	    const message$ = task.name$.pipe(
          mergeMap(name => this.translate.get('crop_view_page.task_x_deleted', { name: name }))
        );
		this.snackbar.open(message$);
        this.ngOnInit();
      }),
    );
  }

  private openConfirmDialog(task: Task): Observable<boolean> {
	return task.name$.pipe(
	  mergeMap(name => this.confirmDialog.open({
        title: this.translate.get('delete_dialog.title', { name: name }),
        message: this.translate.get('delete_dialog.message', { name: name }),
      }).afterClosed())
    );
  }

}