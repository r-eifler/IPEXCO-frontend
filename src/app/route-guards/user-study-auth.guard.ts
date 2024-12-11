import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import {selectExecutionUserStudy} from '../user_study_execution/state/user-study-execution.selector';
import {selectLoggedIn} from '../user/state/user.selector';
import {combineLatest} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UserStudyAuthGuard  {

  store = inject(Store)
  router = inject(Router)

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.checkLogin();
  }

  checkLogin(): Observable<boolean | UrlTree> {
    return combineLatest([this.store.select(selectLoggedIn), this.store.select(selectExecutionUserStudy)]).pipe(
      take(1),
      map(([isLoggedIn, study]) => {
        if (isLoggedIn) {
          return true;
        }
        if (study) {
          return this.router.parseUrl('user-study-execution/' + study._id);
        }
        return this.router.parseUrl('user-study-execution/fail');
      })
    );
  }
}

