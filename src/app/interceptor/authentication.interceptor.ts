import { HttpHandlerFn, HttpRequest,} from "@angular/common/http";
import { selectToken } from "../user/state/user.selector";
import { toSignal } from "@angular/core/rxjs-interop";
import { inject } from "@angular/core";
import { Store } from "@ngrx/store";


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

  const token =  toSignal(inject(Store).select(selectToken));
  
  if(!token()){
    return next(req);
  }

  const newReq = req.clone({
    headers: req.headers.append('Authorization', 'Bearer ' + token()),
  });
  
  return next(newReq);
}