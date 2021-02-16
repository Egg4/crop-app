import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, OnInit, AfterViewInit } from '@angular/core';

import { delay } from 'rxjs/operators';

import { listAnimation } from '../../../../animations/list.animation';
import { listItemAnimation } from '../../../../animations/list-item.animation';
import { Seeding } from '../../../../models/seeding.model';
import { SeedingFactory } from '../../../../factories/seeding-factory.service';
import { SeedingFormComponent } from '../seeding-form/seeding-form.component';
import { VarietyListHandler } from '../variety-list-handler.service';

@Component({
  selector: 'app-seeding-pane',
  templateUrl: './seeding-pane.component.html',
  animations: [ listAnimation, listItemAnimation ],
})
export class SeedingPaneComponent implements OnInit, AfterViewInit {
  @ViewChildren(SeedingFormComponent) private  seedingFormComponents: QueryList<SeedingFormComponent>;
  @Input() public seedings: Seeding[];
  @Input() public taskId: number;
  @Input() public cropId: number;
  @Output() public paneChange = new EventEmitter();

  private initialSeedings: Seeding[];
  private varietiesCount: number;
  public canAddForm: boolean;

  constructor(
    private factory: SeedingFactory,
    private varietyListHandler: VarietyListHandler,
  ) { }

  public ngOnInit(): void {
    this.seedings = [...this.seedings];
	this.initialSeedings = [...this.seedings];
    this.subscribeVarietyList();
  }

  public ngAfterViewInit(): void {
    this.subscribeHarvestingFormComponentsChanges();
  }

  private subscribeVarietyList(): void {
    this.varietyListHandler.list$.subscribe(
      varieties => {
        this.varietiesCount = varieties.length;
        this.canAddForm = this.seedings.length < this.varietiesCount + 1;
      }
    );
  }

  private subscribeHarvestingFormComponentsChanges(): void {
    this.seedingFormComponents.changes.pipe(
      delay(0)
    ).subscribe(_ => {
        this.canAddForm = this.seedings.length < this.varietiesCount + 1;
        this.paneChange.emit();
    });
  }

  public formChange(): void {
	this.paneChange.emit();
  }

  public addForm(): void {
    this.seedings.unshift(this.factory.create({
      id: null,
      task_id: this.taskId,
      variety_id: null,
      mode: null,
      density: null,
      area: null,
      unit: null,
    }));
  }

  public removeForm(index: number): void {
    this.seedings.splice(index, 1);
  }

  public get dirty(): boolean {
	return !Object.deepEqual(this.value, this.initialSeedings);
  }

  public get valid(): boolean {
	return this.seedingFormComponents
      .map(seedingForm => seedingForm.form.valid)
      .reduce((acc, cur) => acc && cur, true);
  }

  public get value(): Seeding[] {
    return this.seedingFormComponents.map(seedingForm => seedingForm.value);
  }

}