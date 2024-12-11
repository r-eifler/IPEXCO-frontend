import { inject, Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { switchMap, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import {selectExecutionUserStudy, selectExecutionUserStudyCanceled, selectExecutionUserStudyStepIndex} from '../user-study-execution.selector';
import {Router} from '@angular/router';
import { concatLatestFrom } from '@ngrx/operators';


@Injectable()
export class UserStudyStartedEffect{

    private store = inject(Store);
    private router = inject(Router);

    public checkLogin$ = createEffect(() => this.store.select(selectExecutionUserStudyStepIndex).pipe(
        tap(index => console.log('step index: ' + index)),
        concatLatestFrom(() => this.store.select(selectExecutionUserStudy)),
        tap(([index, study]) => {
            if(index === 0){
              this.router.navigate(['user-study-execution', study._id, 'step'])
            }
        })
      ), {dispatch: false}
    )
}
