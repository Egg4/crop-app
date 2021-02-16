import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Observable, range } from 'rxjs';
import { map, delay, toArray } from 'rxjs/operators';

import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnInit {
  @Input() public task: Task;
  @Output() public formChange = new EventEmitter();

  public times$: Observable<{ value: string; label: string; }[]>;
  public form = this.formBuilder.group({
    id: [],
    crop_id: [],
	type: [],
	date: ['', [
	  Validators.required,
	]],
	time: ['', [
	  Validators.required,
	]],
    done: [false, [
	  Validators.required,
	]],
  });

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  public ngOnInit(): void {
    this.times$ = this.buildTimes();
    this.populate(this.task);
    this.subscribeFormChanges();
  }

  private buildTimes(): Observable<{ value: string; label: string; }[]> {
    return range(6, 18).pipe(
	  delay(0),
      map(num => {
        const hour = num.toString().padStart(2, '0');
        return {
          value: `${ hour }:00:00`,
          label: `${ hour }:00`,
        };
      }),
      toArray(),
    );
  }

  private populate(task: Task): void {
    this.form.setValue({
      id: task.id,
      crop_id: task.crop_id,
      type: task.type,
      date: new Date(task.date),
      time: task.time,
      done: task.done,
    });
  }

  private subscribeFormChanges(): void {
    this.form.valueChanges.subscribe(_ => this.formChange.emit());
  }

  public get value(): Task {
	const task = this.form.value;
	const date = this.form.get('date').value;
	const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
	task.date = `${ year }-${ month }-${ day }`;
	return task;
  }

}
