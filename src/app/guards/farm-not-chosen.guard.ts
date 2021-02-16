import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';

import { Authentication } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FarmNotChosenGuard implements CanActivate {

  constructor(
	private router: Router,
	private authentication: Authentication,
  ) { }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

	if (!this.authentication.isFarmChosen()) {
		return true;
	}

    this.router.navigate(['']);
    return false;
  }

}