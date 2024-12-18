import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../user/state/user.actions';


@Injectable({
  providedIn: 'root',
})
export class LogOutUserStudyAuthGuard  {

  store = inject(Store)

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot)  {
    this.store.dispatch(logout());
    return true;
  }

 
}

