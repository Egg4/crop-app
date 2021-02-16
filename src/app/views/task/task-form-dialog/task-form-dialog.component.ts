import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { Observable, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { TaskPaneComponent } from './task-pane/task-pane.component';
import { WorkingPaneComponent } from './working-pane/working-pane.component';
import { SeedingPaneComponent } from './seeding-pane/seeding-pane.component';
import { PlantingPaneComponent } from './planting-pane/planting-pane.component';
import { HarvestingPaneComponent } from './harvesting-pane/harvesting-pane.component';
import { Task } from '../../../models/task.model';
import { CropStore } from '../../../stores/crop-store.service';
import { TaskStore } from '../../../stores/task-store.service';
import { TaskFactory } from '../../../factories/task-factory.service';
import { VarietyListHandler } from './variety-list-handler.service';

@Component({
  selector: 'app-task-form-dialog',
  templateUrl: './task-form-dialog.component.html',
})
export class TaskFormDialogComponent implements OnInit {
  @ViewChild(TaskPaneComponent) private taskPaneComponent: TaskPaneComponent;
  @ViewChild(WorkingPaneComponent) private workingPaneComponent: WorkingPaneComponent;
  @ViewChild(SeedingPaneComponent) private seedingPaneComponent: SeedingPaneComponent;
  @ViewChild(PlantingPaneComponent) private plantingPaneComponent: PlantingPaneComponent;
  @ViewChild(HarvestingPaneComponent) private harvestingPaneComponent: HarvestingPaneComponent;

  private submitted: boolean = false;
  public submittable: boolean;
  public title$: Observable<string>;

  constructor(
	@Inject(MAT_DIALOG_DATA) public task: Task,
    private dialogRef: MatDialogRef<TaskFormDialogComponent>,
    private translate: TranslateService,
    private cropStore: CropStore,
    private taskStore: TaskStore,
    private taskFactory: TaskFactory,
    private varietyListHandler: VarietyListHandler,
  ) { }

  public ngOnInit(): void {
	const cropId = this.task.crop_id;
	const type = this.task.type;
    this.varietyListHandler.set(cropId);
    if (this.task.id) {
      this.submittable = false;
    }
    else {
      this.task = this.buildTask(cropId, type);
      this.submittable = true;
	}
    this.title$ = combineLatest([
      this.translate.get(type),
      this.cropStore.read(cropId).pipe(mergeMap(crop => crop.name$))
    ]).pipe(
      map(([taskType, cropName]) => (`${ taskType } ${ cropName }`).upperCaseFirst())
    );
  }

  private buildTask(cropId: number, type: string): Task {
    const now = new Date();
	const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
	const hour = now.toLocaleTimeString([], { hour12: false, hour: '2-digit' });
    return this.taskFactory.create({
      id: null,
      crop_id: cropId,
      type: type,   
      date: `${ year }-${ month }-${ day }`,
      time: `${ hour }:00:00`,
      done: false,
      working: null,
      seedings: [],
      plantings: [],
      harvestings: [],
    });
  }

  public paneChange(): void {
    this.submittable = this.isSubmittable();
  }

  public get dirty(): boolean {
    let dirty = this.taskPaneComponent.dirty;
    dirty ||= this.workingPaneComponent ? this.workingPaneComponent.dirty : false;
    dirty ||= this.seedingPaneComponent ? this.seedingPaneComponent.dirty : false;
    dirty ||= this.plantingPaneComponent ? this.plantingPaneComponent.dirty : false;
    dirty ||= this.harvestingPaneComponent ? this.harvestingPaneComponent.dirty : false;
    return dirty;
  }

  public get valid(): boolean {
    let valid = this.taskPaneComponent.valid;
    valid &&= this.workingPaneComponent ? this.workingPaneComponent.valid : true;
    valid &&= this.seedingPaneComponent ? this.seedingPaneComponent.valid : true;
    valid &&= this.plantingPaneComponent ? this.plantingPaneComponent.valid : true;
    valid &&= this.harvestingPaneComponent ? this.harvestingPaneComponent.valid : true;
    return valid;
  }

  public get new(): boolean {
	return this.taskPaneComponent.new;
  }

  private isSubmittable(): boolean {
    return !this.submitted && this.valid && (this.dirty || this.new);
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }

  public onSaveClick(): void {
    this.submitted = true;

	let task = this.taskPaneComponent.value;
    task.working = this.workingPaneComponent ? this.workingPaneComponent.value : null;
    task.seedings = this.seedingPaneComponent ? this.seedingPaneComponent.value : [];
    task.plantings = this.plantingPaneComponent ? this.plantingPaneComponent.value : [];
    task.harvestings = this.harvestingPaneComponent ? this.harvestingPaneComponent.value : [];

	const task$ = this.new ? this.taskStore.create(task) : this.taskStore.update(task);
    task$.subscribe(
      task => this.dialogRef.close(task)
    );
  }

}