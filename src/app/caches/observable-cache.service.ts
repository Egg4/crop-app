import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil, shareReplay } from 'rxjs/operators';

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class ObservableCache {
  private data = {};

  constructor() { }

  get<T>(key: string): Observable<T> {
	if (!this.has(key)) {
		throw new Error(`Key ${key} not found`);
	}

	const { reset$, observable, timeout } = this.data[key];
    if (!this.data[key].cache$) {
      this.data[key].cache$ = observable.pipe(
	    takeUntil(reset$),
        shareReplay(CACHE_SIZE)
      );
      if (timeout > 0) {
	    timer(timeout).pipe(
          takeUntil(reset$)
        ).subscribe(_ => this.reset(key));
      }
    }
    return this.data[key].cache$;
  }

  set<T>(
	key: string, observable: Observable<T>,
    { timeout = 0, preload = false }: { timeout?: number, preload?: boolean }  
  ): void {
    this.data[key] = {
	  cache$: null,
	  reset$: new Subject<void>(),
      observable: observable,
      timeout: timeout,
    };
	if (preload) {
      this.get(key).subscribe();
	}
  }

  reset(key: string): void {
    if (this.has(key)) {
      this.data[key].reset$.next();
      this.data[key].cache$ = null;
	}
  }

  remove(key: string): void {
    delete this.data[key];
  }

  has(key: string): boolean {
    return key in this.data;
  }

  clear(): void {
    for (let key in this.data) {
      this.reset(key);
    }
  }
}
