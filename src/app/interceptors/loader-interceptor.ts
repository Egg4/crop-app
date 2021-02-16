import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Loader } from '../widgets/loader/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(
     private loader: Loader,
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.loader.startLoading(req.url);

    return next.handle(req).pipe(
	  tap(event => {
        if (event instanceof HttpResponse) this.loader.stopLoading(req.url);
      }),
	  catchError(error => {
        this.loader.stopLoading(req.url);
        return throwError(error);
      })
    );

  }

}