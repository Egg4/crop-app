import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { config } from '../config/config';
import { Task } from '../models/task.model';
import { TaskFactory } from '../factories/task-factory.service';
import { ObservableCache } from '../caches/observable-cache.service';

@Injectable({
  providedIn: 'root'
})
export class TaskStore {

  constructor(
	private http: HttpClient,
    private factory: TaskFactory,
    private cache: ObservableCache,
  ) {
	this.cache.set<Task[]>('task.list',
      this.http.get<Task[]>(`${ config.api.url }/task`).pipe(
        map(tasks => tasks.map(task => this.factory.create(task)))
      ),
      { timeout: config.cache.timeout }
    );
  }

  public list(): Observable<Task[]> {
    return this.cache.get<Task[]>('task.list');
  }

  public read(id: number): Observable<Task> {
    return this.list().pipe(
	  map(tasks => tasks.find(task => task.id === id))
    );
  }

  public create(task: Task): Observable<Task> {
    return this.http.post<Task>(`${ config.api.url }/task`, task).pipe(
      map(task => this.factory.create(task)),
	  tap(_ => this.cache.reset('task.list')),
      tap(_ => this.cache.reset('crop.list'))
    );
  }

  public update(task: Task): Observable<Task> {
    return this.http.patch<Task>(`${ config.api.url }/task/${ task.id }`, task).pipe(
      map(task => this.factory.create(task)),
	  tap(_ => this.cache.reset('task.list')),
      tap(_ => this.cache.reset('crop.list'))
    );
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${ config.api.url }/task/${ id }`).pipe(
	  tap(_ => this.cache.reset('task.list')),
      tap(_ => this.cache.reset('crop.list'))
    );
  }

}