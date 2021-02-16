import { Observable } from 'rxjs';

import { Variety } from '../models/variety.model';
import { VarietyStore } from '../stores/variety-store.service';

export class Harvesting {
  public id: number;
  public task_id: number;
  public variety_id: number;
  public quantity: number;
  public unit: string;

  private _variety$: Observable<Variety>;

  constructor(
    data: any,
    private varietyStore: VarietyStore,
  ) {
    Object.assign(this, data);
  }

  public get variety$(): Observable<Variety> {
    if (!this._variety$) {
      this._variety$ = this.varietyStore.read(this.variety_id);
    }
    return this._variety$;
  }

}