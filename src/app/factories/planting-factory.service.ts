import { Injectable } from '@angular/core';

import { Planting } from '../models/planting.model';
import { VarietyStore } from '../stores/variety-store.service';

@Injectable({
  providedIn: 'root'
})
export class PlantingFactory {

  constructor(
    private varietyStore: VarietyStore,
  ) { }

  public create(data?: any): Planting {
	const defaultData = {
      id: Number.random(1000),
      task_id: Number.random(1000),
      variety_id: Number.random(1000),
      intra_row_spacing: 25,
      inter_row_spacing: 25,
      quantity: Number.random(1000),
	};
	return new Planting(
      Object.assign(defaultData, data),
	  this.varietyStore,
    );
  }

}