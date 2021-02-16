import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Task } from '../models/task.model';
import { WorkingFactory } from '../factories/working-factory.service';
import { SeedingFactory } from '../factories/seeding-factory.service';
import { PlantingFactory } from '../factories/planting-factory.service';
import { HarvestingFactory } from '../factories/harvesting-factory.service';

@Injectable({
  providedIn: 'root'
})
export class TaskFactory {

  constructor(
    private translate: TranslateService,
    private workingFactory: WorkingFactory,
    private seedingFactory: SeedingFactory,
    private plantingFactory: PlantingFactory,
    private harvestingFactory: HarvestingFactory,
  ) { }

  public create(data?: any): Task {
	const defaultData = {
      id: Number.random(1000),
      crop_id: Number.random(1000),
      type: 'seeding',
      date: '2020-01-01',
      time: '10:00:00',
      done: false,
      working: null,
      seedings: [],
      plantings: [],
      harvestings: [],
	};
	return new Task(
      Object.assign(defaultData, data),
      this.translate,
      this.workingFactory,
      this.seedingFactory,
      this.plantingFactory,
      this.harvestingFactory
    );
  }

}