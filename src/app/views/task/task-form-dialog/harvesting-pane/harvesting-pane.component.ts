import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, OnInit, AfterViewInit } from '@angular/core';

import { delay } from 'rxjs/operators';

import { listAnimation } from '../../../../animations/list.animation';
import { listItemAnimation } from '../../../../animations/list-item.animation';
import { Harvesting } from '../../../../models/harvesting.model';
import { HarvestingFactory } from '../../../../factories/harvesting-factory.service';
import { HarvestingFormComponent } from '../harvesting-form/harvesting-form.component';
import { VarietyListHandler } from '../variety-list-handler.service';

@Component({
  selector: 'app-harvesting-pane',
  templateUrl: './harvesting-pane.component.html',
  animations: [ listAnimation, listItemAnimation ],
})
export class HarvestingPaneComponent implements OnInit, AfterViewInit {
  @ViewChildren(HarvestingFormComponent) private  harvestingFormComponents: QueryList<HarvestingFormComponent>;
  @Input() public harvestings: Harvesting[];
  @Input() public taskId: number;
  @Output() public paneChange = new EventEmitter();

  private initialHarvestings: Harvesting[];
  private varietiesCount: number;
  public canAddForm: boolean;

  constructor(
    private factory: HarvestingFactory,
    private varietyListHandler: VarietyListHandler,
  ) { }

  public ngOnInit(): void {
	this.harvestings = [...this.harvestings];
	this.initialHarvestings = [...this.harvestings];
    this.subscribeVarietyList();
  }

  public ngAfterViewInit(): void {
    this.subscribeHarvestingFormComponentsChanges();
  }

  private subscribeVarietyList(): void {
    this.varietyListHandler.list$.subscribe(
      varieties => {
        this.varietiesCount = varieties.length;
        this.canAddForm = this.harvestings.length < this.varietiesCount + 1;
      }
    );
  }

  private subscribeHarvestingFormComponentsChanges(): void {
    this.harvestingFormComponents.changes.pipe(
      delay(0)
    ).subscribe(_ => {
        this.canAddForm = this.harvestings.length < this.varietiesCount + 1;
        this.paneChange.emit();
    });
  }

  public formChange(): void {
	this.paneChange.emit();
  }

  public addForm(): void {
    this.harvestings.unshift(this.factory.create({
      id: null,
      task_id: this.taskId,
      variety_id: null,
      quantity: null,
      unit: 'kg',
    }));
  }

  public removeForm(index: number): void {
    this.harvestings.splice(index, 1);
  }

  public get dirty(): boolean {
	return !Object.deepEqual(this.value, this.initialHarvestings);
  }

  public get valid(): boolean {
	return this.harvestingFormComponents
      .map(harvestingForm => harvestingForm.form.valid)
      .reduce((acc, cur) => acc && cur, true);
  }

  public get value(): Harvesting[] {
    return this.harvestingFormComponents.map(harvestingForm => harvestingForm.value);
  }

}