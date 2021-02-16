import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, OnInit, AfterViewInit } from '@angular/core';

import { delay } from 'rxjs/operators';

import { listAnimation } from '../../../../animations/list.animation';
import { listItemAnimation } from '../../../../animations/list-item.animation';
import { Planting } from '../../../../models/planting.model';
import { PlantingFactory } from '../../../../factories/planting-factory.service';
import { PlantingFormComponent } from '../planting-form/planting-form.component';
import { VarietyListHandler } from '../variety-list-handler.service';

@Component({
  selector: 'app-planting-pane',
  templateUrl: './planting-pane.component.html',
  animations: [ listAnimation, listItemAnimation ],
})
export class PlantingPaneComponent implements OnInit, AfterViewInit {
  @ViewChildren(PlantingFormComponent) private  plantingFormComponents: QueryList<PlantingFormComponent>;
  @Input() public plantings: Planting[];
  @Input() public taskId: number;
  @Output() public paneChange = new EventEmitter();

  private initialPlantings: Planting[];
  private varietiesCount: number;
  public canAddForm: boolean;

  constructor(
    private factory: PlantingFactory,
    private varietyListHandler: VarietyListHandler,
  ) { }

  public ngOnInit(): void {
	this.plantings = [...this.plantings];
	this.initialPlantings = [...this.plantings];
    this.subscribeVarietyList();
  }

  public ngAfterViewInit(): void {
    this.subscribeHarvestingFormComponentsChanges();
  }

  private subscribeVarietyList(): void {
    this.varietyListHandler.list$.subscribe(
      varieties => {
        this.varietiesCount = varieties.length;
        this.canAddForm = this.plantings.length < this.varietiesCount + 1;
      }
    );
  }

  private subscribeHarvestingFormComponentsChanges(): void {
    this.plantingFormComponents.changes.pipe(
      delay(0)
    ).subscribe(_ => {
        this.canAddForm = this.plantings.length < this.varietiesCount + 1;
        this.paneChange.emit();
    });
  }

  public formChange(): void {
	this.paneChange.emit();
  }

  public addForm(): void {
    this.plantings.unshift(this.factory.create({
      id: null,
      task_id: this.taskId,
      variety_id: null,
      intra_row_spacing: null,
      inter_row_spacing: null,
      quantity: null,
    }));
  }

  public removeForm(index: number): void {
    this.plantings.splice(index, 1);
  }

  public get dirty(): boolean {
	return !Object.deepEqual(this.value, this.initialPlantings);
  }

  public get valid(): boolean {
	return this.plantingFormComponents
      .map(plantingForm => plantingForm.form.valid)
      .reduce((acc, cur) => acc && cur, true);
  }

  public get value(): Planting[] {
    return this.plantingFormComponents.map(plantingForm => plantingForm.value);
  }

}