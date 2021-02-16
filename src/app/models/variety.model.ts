import { Observable } from 'rxjs';

import { Plant } from '../models/plant.model';
import { PlantStore } from '../stores/plant-store.service';

export class Variety {
  public id: number;
  public plant_id: number;
  public name: string;

  private _plant$: Observable<Plant>;

  constructor(
    data: any,
    private plantStore: PlantStore,
  ) {
    Object.assign(this, data);
  }

  public get plant$(): Observable<Plant> {
    if (!this._plant$) {
      this._plant$ = this.plantStore.read(this.plant_id);
    }
    return this._plant$;
  }

  public static compare(a: Variety, b: Variety): number {
    const nameA = a.name.removeDiacritics();
    const nameB = b.name.removeDiacritics();
    if (nameA === nameB) return 0;
    return nameA > nameB ? 1 : -1;
  }

}