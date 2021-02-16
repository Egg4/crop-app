import { Observable } from 'rxjs';

import { Variety } from '../models/variety.model';
import { VarietyStore } from '../stores/variety-store.service';

export class Planting {
  public id: number;
  public task_id: number;
  public variety_id: number;
  public intra_row_spacing: number;
  public inter_row_spacing: number;
  public quantity: number;

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