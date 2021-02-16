import { Injectable } from '@angular/core';

import { Working } from '../models/working.model';

@Injectable({
  providedIn: 'root'
})
export class WorkingFactory {

  constructor() { }

  public create(data?: any): Working {
	const defaultData = {
      id: Number.random(1000),
      task_id: Number.random(1000),
      duration: '01:00:00',
      mwu: Number.random(10),
	};
	return new Working(
      Object.assign(defaultData, data),
    );
  }

}