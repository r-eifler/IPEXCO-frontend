import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectLoggedIn } from "../user/state/user.selector";
import { map, Observable, take } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ToHomeGuard  {

  store = inject(Store)
  router = inject(Router)

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.checkLogin();
  }

  checkLogin(): Observable<boolean | UrlTree> {

    return this.store.select(selectLoggedIn).pipe(take(1)).pipe(
      map(isLoggedIn => {
        console.log("To Home guard: logged in: " + isLoggedIn);
        if(isLoggedIn){
          return true;
        }
        else {
          return this.router.parseUrl("/user/register");
        }
      })
    )
  }
}
