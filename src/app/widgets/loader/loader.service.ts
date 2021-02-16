import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Loader {
  readonly loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private urls: Set<string> = new Set<string>();

  constructor() { }

  public startLoading(url: string): void {
	if (!this.urls.has(url)) {
      this.urls.add(url);
      if (this.urls.size === 1) {
        this.loading.next(true);
      }    
    }
  }

  public stopLoading(url: string): void {
    if (this.urls.has(url)) {
      this.urls.delete(url);
    }

    if (this.urls.size === 0) {
      this.loading.next(false);
    }
  }

}