import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectIsUserStudy, selectLoggedIn } from "../user/state/user.selector";
import { combineLatest, map, Observable, take } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard  {

  store = inject(Store)
  router = inject(Router)

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.checkLogin();
  }

  checkLogin(): Observable<boolean | UrlTree> {

    return combineLatest([this.store.select(selectLoggedIn), this.store.select(selectIsUserStudy)]).pipe(
      take(1),
      map(([isLoggedIn, isUserStudy]) => {
        console.log("Auth guard: logged in: " + isLoggedIn + " userStudy: " + isUserStudy);
        if(isLoggedIn && ! isUserStudy){
          return true;
        }
        if(isUserStudy){
          return this.router.parseUrl("/user-study-execution/fail");
        }
        
        return this.router.parseUrl("/register");
        
      })
    )
  }
}
