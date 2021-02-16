import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { tap, map, filter, mergeMap } from 'rxjs/operators';

import { listAnimation } from '../../../animations/list.animation';
import { listItemAnimation } from '../../../animations/list-item.animation';
import { Task } from '../../../models/task.model';
import { TaskStore } from '../../../stores/task-store.service';
import { TaskListActionSheetComponent } from './task-list-action-sheet/task-list-action-sheet.component';
import { TaskFormDialogComponent } from '../../task/task-form-dialog/task-form-dialog.component';
import { FormDialogConfig } from '../../../widgets/dialogs/form-dialog/form-dialog-config';
import { ConfirmDialogService } from '../../../widgets/dialogs/confirm-dialog/confirm-dialog.service';
import { NotificationSnackbarService } from '../../../widgets/snackbars/notification-snackbar/notification-snackbar.service';

@Component({
  selector: 'app-task-list-page',
  templateUrl: './task-list-page.component.html',
  animations: [ listAnimation, listItemAnimation ],
})
export class TaskListPageComponent implements OnInit {
  public todoDates$: Observable<Date[]>;
  public doneDates$: Observable<Date[]>;

  constructor(
	private bottomSheet: MatBottomSheet,
	private dialog: MatDialog,
	private translate: TranslateService,
	private confirmDialog: ConfirmDialogService,
	private snackbar: NotificationSnackbarService,
	private taskStore: TaskStore,
  ) { }

  public ngOnInit(): void {
	this.todoDates$ = this.taskStore.list().pipe(
      map(tasks => tasks.filter(task => !task.done)),
      map(tasks => tasks.sort(Task.compare).reverse()),
      map(tasks => Array.from(new Set(tasks.map(task => task.date.substring(0, 7))))),
      map(dates => dates.map(date => new Date(`${ date }-01`))),
    );

    this.doneDates$ = this.taskStore.list().pipe(
      map(tasks => tasks.filter(task => task.done)),
      map(tasks => tasks.sort(Task.compare).reverse()),
      map(tasks => Array.from(new Set(tasks.map(task => task.date.substring(0, 7))))),
      map(dates => dates.map(date => new Date(`${ date }-01`))),
    );
  }

  public getTodoTasks(date: Date): Observable<Task[]> {
    return this.taskStore.list().pipe(
      map(tasks => tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.getFullYear() === date.getFullYear()
          && taskDate.getMonth() === date.getMonth();
      })),
      map(tasks => tasks.filter(task => !task.done)),
      map(tasks => tasks.sort(Task.compare).reverse()),
    );
  }

  public getDoneTasks(date: Date): Observable<Task[]> {
    return this.taskStore.list().pipe(
      map(tasks => tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.getFullYear() === date.getFullYear()
          && taskDate.getMonth() === date.getMonth();
      })),
      map(tasks => tasks.filter(task => task.done)),
      map(tasks => tasks.sort(Task.compare).reverse()),
    );
  }

  public onItemPress(task: Task): void {
	this.bottomSheet.open(TaskListActionSheetComponent, { data: task }).afterDismissed().pipe(
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
          mergeMap(name => this.translate.get('task_list_page.task_x_updated', { name: name }))
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
          mergeMap(name => this.translate.get('task_list_page.task_x_deleted', { name: name }))
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