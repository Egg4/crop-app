import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { config } from '../config/config';
import { Authentication } from '../authentication/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authentication: Authentication
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const toApi = req.url.startsWith(config.api.url);
    const hasAuthToken = req.headers.has('Auth-Token');

    if (toApi && !hasAuthToken && this.authentication.hasToken()) {
      const token = this.authentication.getToken();
      const newReq = req.clone({ setHeaders: { 'Auth-Token': token } });
      return next.handle(newReq);
    }

    return next.handle(req);
  }

}