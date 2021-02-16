import { Injectable } from '@angular/core';

import { Harvesting } from '../models/harvesting.model';
import { VarietyStore } from '../stores/variety-store.service';

@Injectable({
  providedIn: 'root'
})
export class HarvestingFactory {

  constructor(
    private varietyStore: VarietyStore,
  ) { }

  public create(data?: any): Harvesting {
	const defaultData = {
      id: Number.random(1000),
      task_id: Number.random(1000),
      variety_id: Number.random(1000),
      quantity: Number.random(1000),
      unit: 'kg',
	};
	return new Harvesting(
      Object.assign(defaultData, data),
	  this.varietyStore,
    );
  }

}