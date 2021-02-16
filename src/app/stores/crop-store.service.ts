import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { config } from '../config/config';
import { Crop } from '../models/crop.model';
import { CropFactory } from '../factories/crop-factory.service';
import { ObservableCache } from '../caches/observable-cache.service';

@Injectable({
  providedIn: 'root'
})
export class CropStore {

  constructor(
	private http: HttpClient,
    private factory: CropFactory,
    private cache: ObservableCache,
  ) {
    this.cache.set<Crop[]>('crop.list',
      this.http.get<Crop[]>(`${ config.api.url }/crop`).pipe(
        map(crops => crops.map(crop => this.factory.create(crop)))
      ),
      { timeout: config.cache.timeout }
    );
  }

  public list(): Observable<Crop[]> {
	return this.cache.get<Crop[]>('crop.list');
  }

  public read(id: number): Observable<Crop> {
	return this.list().pipe(
	  map(crops => crops.find(crop => crop.id === id))
    );
  }

  public create(crop: Crop): Observable<Crop> {
    return this.http.post<Crop>(`${ config.api.url }/crop`, crop).pipe(
      map(crop => this.factory.create(crop)),
	  tap(_ => this.cache.reset('crop.list'))
    );
  }

  public update(crop: Crop): Observable<Crop> {
    return this.http.patch<Crop>(`${ config.api.url }/crop/${ crop.id }`, crop).pipe(
      map(crop => this.factory.create(crop)),
	  tap(_ => this.cache.reset('crop.list'))
    );
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${ config.api.url }/crop/${ id }`).pipe(
      tap(_ => this.cache.reset('crop.list'))
    );
  }

  public exists(crop: Crop): Observable<Crop> {
    return this.http.post<Crop>(`${ config.api.url }/crop/exists`, crop);
  }

}
