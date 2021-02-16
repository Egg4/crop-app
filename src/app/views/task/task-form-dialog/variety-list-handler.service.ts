import { Injectable } from '@angular/core';

import { Observable, Subject, combineLatest } from 'rxjs';
import { map, startWith, mergeMap, delay, tap } from 'rxjs/operators';

import { Variety } from '../../../models/variety.model';
import { CropStore } from '../../../stores/crop-store.service';
import { VarietyStore } from '../../../stores/variety-store.service';

@Injectable({
  providedIn: 'root'
})
export class VarietyListHandler {
  
  private _list$: Observable<Variety[]>;
  private listSubject$ = new Subject<void>();
  private _availables$: Observable<Variety[]>;
  private holdVarietyIds: number[] = [];
  private availablesSubject$ = new Subject<void>();

  constructor(
    private cropStore: CropStore,
    private varietyStore: VarietyStore,
  ) { }

  public set(cropId: number): void {
    this.holdVarietyIds = [];

    const crop$ = this.cropStore.read(cropId);
    const cropPlantIds$ = crop$.pipe(map(crop => crop.plant_ids));

    this._list$ = this.listSubject$.pipe(
	  startWith(false),
	  mergeMap(_ => combineLatest([
        cropPlantIds$,
        this.varietyStore.list()
      ]).pipe(
        map(([cropPlantIds, allVarieties]) => 
          allVarieties.filter(variety => cropPlantIds.includes(variety.plant_id))
        ),
        map(varieties => varieties.sort(Variety.compare)),
      )
    ));

    this._availables$ = this.availablesSubject$.pipe(
      startWith(false),
      mergeMap(_ => this._list$),
    );
  }

  public get list$(): Observable<Variety[]> {
    return this._list$;
  }

  public get availables$(): Observable<Variety[]> {
    return this._availables$.pipe(
      delay(0),
      map(varieties => {
	    return varieties.filter(variety => !this.holdVarietyIds.includes(variety.id))
      }),
    );
  }

  public hold(varietyId: number): void {
	if (!this.holdVarietyIds.includes(varietyId)) this.holdVarietyIds.push(varietyId);
  }

  public release(varietyId: number): void {
	this.holdVarietyIds = this.holdVarietyIds.filter(consumedVarietyId => consumedVarietyId !== varietyId);
  }

  public updateList(): void {
    this.listSubject$.next();
  }

  public updateAvailables(): void {
    this.availablesSubject$.next();
  }

}