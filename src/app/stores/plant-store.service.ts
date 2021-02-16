import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { config } from '../config/config';
import { Plant } from '../models/plant.model';
import { PlantFactory } from '../factories/plant-factory.service';
import { ObservableCache } from '../caches/observable-cache.service';

@Injectable({
  providedIn: 'root'
})
export class PlantStore {

  constructor(
	private http: HttpClient,
    private factory: PlantFactory,
	private cache: ObservableCache,
  ) {
    this.cache.set<Plant[]>('plant.list',
      this.http.get<Plant[]>(`${ config.api.url }/plant`).pipe(
        map(plants => plants.map(plant => this.factory.create(plant)))
      ),
      { timeout: 0 }
    );
  }

  public list(): Observable<Plant[]> {
    return this.cache.get<Plant[]>('plant.list');
  }

  public read(id: number): Observable<Plant> {
	return this.list().pipe(
	  map(plants => plants.find(plant => plant.id === id))
    );
  }

}