import { Injectable } from '@angular/core';

import { Farm } from '../models/farm.model';

@Injectable({
  providedIn: 'root'
})
export class FarmFactory {

  constructor() { }

  public create(data?: any): Farm {
	const defaultData = {
      id: Number.random(1000),
      name: String.random(4),
	};
	return new Farm(
      Object.assign(defaultData, data),
    );
  }

}