import { Injectable } from '@angular/core';

import { Variety } from '../models/variety.model';
import { PlantStore } from '../stores/plant-store.service';

@Injectable({
  providedIn: 'root'
})
export class VarietyFactory {

  constructor(
    private plantStore: PlantStore,
  ) { }

  public create(data?: any): Variety {
	const defaultData = {
      id: Number.random(1000),
      farm_id: Number.random(1000),
      plant_id: Number.random(1000),
      name: String.random(4),
	};
	return new Variety(
      Object.assign(defaultData, data),
	  this.plantStore,
    );
  }

}