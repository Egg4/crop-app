import { Injectable } from '@angular/core';

import { Plant } from '../models/plant.model';

@Injectable({
  providedIn: 'root'
})
export class PlantFactory {

  constructor() { }

  public create(data?: any): Plant {
	const defaultData = {
      id: Number.random(1000),
      name: String.random(4),
      family: String.random(4),
      genus: String.random(4),
      species: String.random(4),
      color: `#${ String.random(6, '0123456789ABCDEF') }`,
	};
	return new Plant(
      Object.assign(defaultData, data),
    );

  }

}