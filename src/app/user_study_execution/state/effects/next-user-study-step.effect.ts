import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {tap} from 'rxjs/operators';
import {
  executionNextUserStudyStep
} from '../user-study-execution.actions';
import {Router} from '@angular/router';
import {concatLatestFrom} from '@ngrx/operators';
import {
  selectExecutionUserStudy,
  selectExecutionUserStudyStepIndex
} from '../user-study-execution.selector';
import {Store} from '@ngrx/store';



@Injectable()
export class ExecutionNextUserStudyStepEffect{

    private actions$ = inject(Actions)
    private store = inject(Store);
    private router = inject(Router)

    public nextUserStudyStep$ = createEffect(() => this.actions$.pipe(
        ofType(executionNextUserStudyStep),
        concatLatestFrom(() => [this.store.select(selectExecutionUserStudy), this.store.select(selectExecutionUserStudyStepIndex)]),
        tap(([a, study, index]) => {
          if(index < study.steps.length - 1){
            this.router.navigate(['user-study-execution', study._id, 'step', index + 1])
          }
          else{
            this.router.navigate(['user-study-execution', study._id, 'finish'])
          }
        })
    ), {dispatch: false})
}
