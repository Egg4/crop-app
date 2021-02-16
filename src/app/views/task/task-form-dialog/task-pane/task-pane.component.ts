import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';

import { Task } from '../../../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-pane',
  templateUrl: './task-pane.component.html',
})
export class TaskPaneComponent implements OnInit {
  @ViewChild(TaskFormComponent) taskFormComponent: TaskFormComponent;
  @Input() public task: Task;
  @Output() public paneChange = new EventEmitter();

  constructor() { }

  public ngOnInit(): void {
    
  }

  public formChange(): void {
	this.paneChange.emit();
  }

  public get dirty(): boolean {
	return this.taskFormComponent.form.dirty;
  }

  public get valid(): boolean {
	return this.taskFormComponent.form.valid;
  }

  public get new(): boolean {
	return !+this.taskFormComponent.form.get('id').value;
  }

  public get value(): Task {
    return this.task ? this.taskFormComponent.value : null;
  }

}