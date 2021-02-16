import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ErrorInterceptor } from './error-interceptor';
import { LoaderInterceptor } from './loader-interceptor';
import { AcceptInterceptor } from './accept-interceptor';
import { ContentTypeInterceptor } from './content-type-interceptor';
import { AuthInterceptor } from './auth-interceptor';

export const interceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AcceptInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ContentTypeInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];