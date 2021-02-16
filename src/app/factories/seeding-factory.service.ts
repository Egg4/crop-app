import { Injectable } from '@angular/core';

import { Seeding } from '../models/seeding.model';
import { VarietyStore } from '../stores/variety-store.service';

@Injectable({
  providedIn: 'root'
})
export class SeedingFactory {

  constructor(
    private varietyStore: VarietyStore,
  ) { }

  public create(data?: any): Seeding {
	const defaultData = {
      id: Number.random(1000),
      task_id: Number.random(1000),
      variety_id: Number.random(1000),
      mode: 'pluging',
      density: 1,
      area: Number.random(100),
      unit: 'seed/plug',
	};
	return new Seeding(
      Object.assign(defaultData, data),
	  this.varietyStore,
    );
  }

}