import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Farm } from '../../../models/farm.model';
import { FarmStore } from '../../../stores/farm-store.service';

@Component({
  selector: 'app-choose-farm-page',
  templateUrl: './choose-farm-page.component.html',
})
export class ChooseFarmPageComponent implements OnInit {
  public farms$: Observable<Farm[]>;

  constructor(
	private router: Router,
    private farmStore: FarmStore,
  ) { }

  public ngOnInit(): void {
	this.farms$ = this.farmStore.list().pipe(
      tap(farms => {
        if (farms.length === 1) this.chooseFarm(farms[0]);
      })
    );
  }

  public onItemClick(farm: Farm): void {
	this.chooseFarm(farm);
  }

  private chooseFarm(farm: Farm): void {
	this.farmStore.choose(farm).pipe(
      tap (_ => this.router.navigate([''])),
	).subscribe();
  }

}