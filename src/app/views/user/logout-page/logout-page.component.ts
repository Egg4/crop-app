import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';

import { UserStore } from '../../../stores/user-store.service';

@Component({
  selector: 'app-logout-page',
  template: '',
})
export class LogoutPageComponent implements OnInit {

  constructor(
    private router: Router,
    private userStore: UserStore,
  ) { }

  public ngOnInit(): void {
	this.userStore.logout().pipe(
      tap(_ => this.router.navigate([''])),
	).subscribe();
  }

}