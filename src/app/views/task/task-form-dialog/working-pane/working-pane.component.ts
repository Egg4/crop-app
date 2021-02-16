import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, OnInit, AfterViewInit } from '@angular/core';

import { delay } from 'rxjs/operators';

import { listItemAnimation } from '../../../../animations/list-item.animation';
import { Working } from '../../../../models/working.model';
import { WorkingFactory } from '../../../../factories/working-factory.service';
import { WorkingFormComponent } from '../working-form/working-form.component';

@Component({
  selector: 'app-working-pane',
  templateUrl: './working-pane.component.html',
  animations: [ listItemAnimation ],
})
export class WorkingPaneComponent implements OnInit, AfterViewInit {
  @ViewChildren(WorkingFormComponent) private  workingFormComponents: QueryList<WorkingFormComponent>;
  @Input() public working: Working;
  @Input() public taskId: number;
  @Output() public paneChange = new EventEmitter();

  private initialWorking: Working;

  constructor(
    private factory: WorkingFactory,
  ) { }

  public ngOnInit(): void {
    this.initialWorking = this.working;
  }

  public ngAfterViewInit(): void {
    this.subscribeWorkingFormComponentsChanges();
  }

  private subscribeWorkingFormComponentsChanges(): void {
    this.workingFormComponents.changes.pipe(
      delay(0)
    ).subscribe(_ => {
        this.paneChange.emit();
    });
  }

  public formChange(): void {
	this.paneChange.emit();
  }

  public addForm(): void {
	this.working = this.factory.create({
      id: null,
      task_id: this.taskId,
      duration: '01:00:00',
      mwu: 1,
    });
  }

  public removeForm(): void {
    this.working = null;
  }

  public get dirty(): boolean {
	return !Object.deepEqual(this.value, this.initialWorking);
  }

  public get valid(): boolean {
	return this.workingFormComponents
      .map(workingForm => workingForm.form.valid)
      .reduce((acc, cur) => acc && cur, true);
  }

  public get value(): Working {
    return this.working ? this.workingFormComponents.first.value : null;
  }

}