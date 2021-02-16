import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { config } from '../config/config';

const RETRY_NUMBER = 0;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      retry(RETRY_NUMBER),
      catchError((err: HttpErrorResponse) => {

        // client-side error
        if (err.error instanceof ErrorEvent) {
          return throwError(err.error);
        }

        // network error
        if (err.status === 0) {
          return throwError({ name: 'network_error', message: 'Check your network connection'});
        }

        // api-side error
        const toApi = req.url.startsWith(config.api.url);
        if (toApi) {
          return throwError(err.error[0]);
        }

        // server-side error
        return throwError(err);
      })
    );
  }

}