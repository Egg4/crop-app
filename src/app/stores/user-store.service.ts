import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { config } from '../config/config';
import { Authentication } from '../authentication/authentication.service';
import { ObservableCache } from '../caches/observable-cache.service';

@Injectable({
  providedIn: 'root'
})
export class UserStore {

  constructor(
	private http: HttpClient,
	private authentication: Authentication,
	private cache: ObservableCache,
  ) { }

  public login(data: any): Observable<void> {
    return this.http.post<any>(`${ config.api.url }/user/login`, data).pipe(
	  tap(data => this.authentication.setToken(data.token))
    );
  }

  public logout(): Observable<void> {
    return of(undefined).pipe(
	  tap(_ => {
		this.authentication.removeToken();
		this.authentication.removeFarmChosen();
		this.cache.clear();
	  })
    );
  }

}