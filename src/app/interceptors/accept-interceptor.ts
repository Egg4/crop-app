import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { config } from '../config/config';

@Injectable()
export class AcceptInterceptor implements HttpInterceptor {

  constructor() { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const toApi = req.url.startsWith(config.api.url);
    const hasAccept = req.headers.has('Accept');

    if (toApi && !hasAccept) {
      const newReq = req.clone({ setHeaders: { 'Accept': config.api.headers['Accept'] } });
      return next.handle(newReq);
    }

    return next.handle(req);
  }

}