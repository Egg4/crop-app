import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { config } from '../config/config';

@Injectable()
export class ContentTypeInterceptor implements HttpInterceptor {

  constructor() { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const toApi = req.url.startsWith(config.api.url);
    const hasContentType = req.headers.has('Content-Type');

    if (toApi && !hasContentType) {
      const newReq = req.clone({ setHeaders: { 'Content-Type': config.api.headers['Content-Type'] } });
      return next.handle(newReq);
    }

    return next.handle(req);
  }

}