import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { config } from '../config/config';
import { Authentication } from '../authentication/authentication.service';
import { Farm } from '../models/farm.model';
import { FarmFactory } from '../factories/farm-factory.service';
import { ObservableCache } from '../caches/observable-cache.service';

@Injectable({
  providedIn: 'root'
})
export class FarmStore {

  constructor(
	private http: HttpClient,
    private factory: FarmFactory,
	private cache: ObservableCache,
	private authentication: Authentication,
  ) {
    this.cache.set<Farm[]>('farm.list',
      this.http.get<Farm[]>(`${ config.api.url }/farm`).pipe(
        map(crops => crops.map(crop => this.factory.create(crop)))
      ),
      { preload: false });
  }

  public list(): Observable<Farm[]> {
    return this.cache.get<Farm[]>('farm.list');
  }

  public read(id: number): Observable<Farm> {
	return this.list().pipe(
	  map(farms => farms.find(farm => farm.id === id))
    );
  }

  public choose(farm: Farm): Observable<Farm> {
	var data = { id: farm.id };
	return this.http.post<any>(`${ config.api.url }/farm/choose`, data).pipe(
	  tap(data => {
		this.authentication.setToken(data.token);
		this.authentication.setFarmChosen();
	  })
    );
  }

}