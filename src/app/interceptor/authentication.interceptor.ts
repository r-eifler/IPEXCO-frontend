import { inject, Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";

import { map, Observable, switchMap, take } from "rxjs";
import { Store } from "@ngrx/store";
import { selectToken } from "../user/state/user.selector";

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  store = inject(Store)

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select(selectToken).pipe(
      take(1),
      switchMap(token => {
        if(!token){
          return next.handle(req);
        }
        else{ 
          return next.handle(req.clone({
            setHeaders: {Authorization: "Bearer " + token},
          }))
        }
      }
    ))
  }
}
