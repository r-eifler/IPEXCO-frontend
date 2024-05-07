import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthenticationService } from "../service/authentication/authentication.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard  {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    return this.checkLogin();
  }

  checkLogin(): true | UrlTree {
    if (this.authService.loggedIn()) {
      return true;
    }

    return this.router.parseUrl("/");
  }
}
