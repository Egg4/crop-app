import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Working } from '../models/working.model';
import { Seeding } from '../models/seeding.model';
import { Planting } from '../models/planting.model';
import { Harvesting } from '../models/harvesting.model';
import { WorkingFactory } from '../factories/working-factory.service';
import { SeedingFactory } from '../factories/seeding-factory.service';
import { PlantingFactory } from '../factories/planting-factory.service';
import { HarvestingFactory } from '../factories/harvesting-factory.service';

export class Task {
  public id: number;
  public crop_id: number;
  public type: string;
  public date: string;
  public time: string;
  public done: boolean;
  public working: Working;
  public seedings: Seeding[];
  public plantings: Planting[];
  public harvestings: Harvesting[];

  private _name$: Observable<string>;

  constructor(
    data: any,
    private translate: TranslateService,
    private workingFactory: WorkingFactory,
    private seedingFactory: SeedingFactory,
    private plantingFactory: PlantingFactory,
    private harvestingFactory: HarvestingFactory,
  ) {
    Object.assign(this, data);
    this.working = this.working ? this.workingFactory.create(this.working) : null;
    this.seedings = this.seedings.map(seeding => this.seedingFactory.create(seeding));
    this.plantings = this.plantings.map(planting => this.plantingFactory.create(planting));
    this.harvestings = this.harvestings.map(harvesting => this.harvestingFactory.create(harvesting));
  }

  public get name$(): Observable<string> {
    if (!this._name$) {
      this._name$ = this.translate.get([this.type, 'date_format', 'local_code']).pipe(
        map(t => `${ t[this.type] } ${ formatDate(this.date, t.date_format, t.local_code) }`),
        map(name => name.upperCaseFirst()),
      );
    }
    return this._name$;
  }

  public static compare(a: Task, b: Task): number {
    const dateA = new Date(`${ a.date } ${ a.time }`);
    const dateB = new Date(`${ b.date } ${ b.time }`);
    if (dateA.getTime() === dateB.getTime()) return 0;
    return dateA < dateB ? 1 : -1;
  }

}