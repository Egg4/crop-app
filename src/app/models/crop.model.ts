import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Plant } from '../models/plant.model';
import { Task } from '../models/task.model';
import { PlantStore } from '../stores/plant-store.service';
import { TaskStore } from '../stores/task-store.service';

export class Crop {
  public id: number;
  public number: number;
  public mode: string;
  public plant_ids: number[];
  public task_ids: number[];

  private _plants$: Observable<Plant[]>;
  private _tasks$: Observable<Task[]>;
  private _name$: Observable<string>;
  private _color$: Observable<string>;

  constructor(
    data: any,
    private plantStore: PlantStore,
    private taskStore: TaskStore,
  ) {
    Object.assign(this, data);
  }

  public get plants$(): Observable<Plant[]> {
    if (!this._plants$) {
      this._plants$ = combineLatest(this.plant_ids.map(id => this.plantStore.read(id))).pipe(
        map(plants => plants.sort(Plant.compare)),
      );
    }
    return this._plants$;
  }

  public get tasks$(): Observable<Task[]> {
    if (!this._tasks$) {
      this._tasks$ = combineLatest(this.task_ids.map(id => this.taskStore.read(id))).pipe(
        map(tasks => tasks.sort(Task.compare)),
      );
    }
    return this._tasks$;
  }

  public get name$(): Observable<string> {
    if (!this._name$) {
      this._name$ = this.plants$.pipe(
        map(plants => `${ plants.map(plant => plant.name).join(' ') } ${ this.number }`),
      );
    }
    return this._name$;
  }

  public get color$(): Observable<string> {
    if (!this._color$) {
      this._color$ = this.plants$.pipe(
        map(plants => plants[0].color)
      );
    }
    return this._color$;
  }

}