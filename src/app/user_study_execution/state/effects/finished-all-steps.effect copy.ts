import { inject, Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { switchMap, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import {selectExecutionUserStudy, selectExecutionUserStudyFinishedAllSteps} from '../user-study-execution.selector';
import {Router} from '@angular/router';
import { concatLatestFrom } from '@ngrx/operators';


@Injectable()
export class UserStudyFinishedAllStepsEffect{

    private store = inject(Store);
    private router = inject(Router);

    public finished$ = createEffect(() => this.store.select(selectExecutionUserStudyFinishedAllSteps).pipe(
        tap(isFinished => console.log('Finsihed Steps Status: ' + isFinished)),
        concatLatestFrom(() => this.store.select(selectExecutionUserStudy)),
        tap(([isFinished, study]) => {
          if(isFinished){
            this.router.navigate(['user-study-execution', study._id, 'finish'])
          }
      })
      ), {dispatch: false}
    )
}
