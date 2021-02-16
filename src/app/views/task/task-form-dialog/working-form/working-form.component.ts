import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Working } from '../../../../models/working.model';

@Component({
  selector: 'app-working-form',
  templateUrl: './working-form.component.html',
})
export class WorkingFormComponent implements OnInit {
  @Input() public working: Working;
  @Output() public formChange = new EventEmitter();

  public durations = [
    { value: '00:05:00', label: '00:05' },
    { value: '00:15:00', label: '00:15' },
    { value: '00:30:00', label: '00:30' },
    { value: '00:45:00', label: '00:45' },
    { value: '01:00:00', label: '01:00' },
    { value: '01:30:00', label: '01:30' },
    { value: '02:00:00', label: '02:00' },
    { value: '02:30:00', label: '02:30' },
    { value: '03:00:00', label: '03:00' },
    { value: '04:00:00', label: '04:00' },
    { value: '06:00:00', label: '06:00' },
    { value: '08:00:00', label: '08:00' },
    { value: '12:00:00', label: '12:00' },
  ];
  public form = this.formBuilder.group({
    id: [],
    task_id: [],
	duration: ['', [
	  Validators.required,
	]],
	mwu: ['', [
	  Validators.required,
	]],
  });

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  public ngOnInit(): void {
	this.populate(this.working);
    this.subscribeFormChanges();
  }

  private populate(working: Working): void {
    this.form.setValue({
      id: working.id,
      task_id: working.task_id,
      duration: working.duration,
      mwu: working.mwu,
    });
  }

  private subscribeFormChanges(): void {
    this.form.valueChanges.subscribe(_ => this.formChange.emit());
  }

  public addNumber(number: number): void {
    let value = +this.form.get('mwu').value + number;
    if (value < 1) value = 1;
    if (value > 20) value = 20;
    this.form.get('mwu').markAsDirty();
    this.form.get('mwu').setValue(value);
  }

  public isSubmittable(): boolean {
    const isNew = (!+this.form.get('id').value);
    return this.form.valid && (isNew || this.form.dirty);
  }

  public get value(): Working {
	return this.form.value;
  }

}
