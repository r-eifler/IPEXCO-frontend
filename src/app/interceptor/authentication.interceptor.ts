import { HttpHandlerFn, HttpRequest,} from "@angular/common/http";
import { selectToken } from "../user/state/user.selector";
import { toSignal } from "@angular/core/rxjs-interop";


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

  const token =  toSignal(this.store.select(selectToken));
  
  if(!token()){
    return next(req);
  }

  const newReq = req.clone({
    headers: req.headers.append('Authorization', 'Bearer ' + token()),
  });
  return next(newReq);
}