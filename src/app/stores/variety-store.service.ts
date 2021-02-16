import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { config } from '../config/config';
import { Variety } from '../models/variety.model';
import { VarietyFactory } from '../factories/variety-factory.service';
import { ObservableCache } from '../caches/observable-cache.service';

@Injectable({
  providedIn: 'root'
})
export class VarietyStore {

  constructor(
	private http: HttpClient,
    private factory: VarietyFactory,
    private cache: ObservableCache,
  ) {
    this.cache.set<Variety[]>('variety.list',
      this.http.get<Variety[]>(`${ config.api.url }/variety`).pipe(
        map(varieties => varieties.map(variety => this.factory.create(variety)))
      ),
      { timeout: config.cache.timeout }
    );
  }

  public list(): Observable<Variety[]> {
	return this.cache.get<Variety[]>('variety.list');
  }

  public read(id: number): Observable<Variety> {
	return this.list().pipe(
	  map(varieties => varieties.find(variety => variety.id === id))
    );
  }

  public create(variety: Variety): Observable<Variety> {
    return this.http.post<Variety>(`${ config.api.url }/variety`, variety).pipe(
      map(variety => this.factory.create(variety)),
	  tap(_ => this.cache.reset('variety.list')),
      tap(_ => this.cache.reset('task.list'))
    );
  }

  public update(variety: Variety): Observable<Variety> {
    return this.http.patch<Variety>(`${ config.api.url }/variety/${ variety.id }`, variety).pipe(
      map(variety => this.factory.create(variety)),
	  tap(_ => this.cache.reset('variety.list')),
      tap(_ => this.cache.reset('task.list'))
    );
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${ config.api.url }/variety/${ id }`).pipe(
	  tap(_ => this.cache.reset('variety.list')),
      tap(_ => this.cache.reset('task.list'))
    );
  }

}