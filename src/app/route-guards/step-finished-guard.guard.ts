import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import {selectExecutionUserStudyStepIndex} from '../user_study_execution/state/user-study-execution.selector';


@Injectable({
  providedIn: 'root',
})
export class StepFinishedGuard  {

  store = inject(Store)
  router = inject(Router)

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.store.select(selectExecutionUserStudyStepIndex).pipe(take(1)).pipe(
      map(stepIndex => {
        const nextIndex = Number(next.paramMap.get('stepId'));

        console.log(stepIndex);
        console.log(nextIndex);

        if(stepIndex === null || nextIndex === null){
          return this.router.parseUrl('/user-study-execution/fail');
        }

        if(stepIndex !== nextIndex - 1){
          return this.router.parseUrl('/user-study-execution/fail');
        }

        return true;
      })
    )
  }
}

