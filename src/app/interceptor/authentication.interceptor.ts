import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token = localStorage.getItem('jwt-token');
    if (! token) {
      token = localStorage.getItem('xai-user-study-jwt-token');
      // console.log('ADD User Study Token to request ...');
    }
    if (token) {
      // console.log('authenticated');
      const cloned = req.clone({
          headers: req.headers.set('Authorization',
              'Bearer ' + token)
      });

      return next.handle(cloned);
  } else {
      // console.log('not authenticated');
      return next.handle(req);
  }
  }
}
