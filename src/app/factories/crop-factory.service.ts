import { Injectable } from '@angular/core';

import { Crop } from '../models/crop.model';
import { PlantStore } from '../stores/plant-store.service';
import { TaskStore } from '../stores/task-store.service';

@Injectable({
  providedIn: 'root'
})
export class CropFactory {

  constructor(
    private plantStore: PlantStore,
    private taskStore: TaskStore,
  ) { }

  public create(data?: any): Crop {
	const defaultData = {
      id: Number.random(1000),
      number: Number.random(1000),
      mode: 'direct_seeding',
      plant_ids: [],
      task_ids: [],
	};
	return new Crop(
      Object.assign(defaultData, data),
	  this.plantStore,
      this.taskStore,
    );
  }

}