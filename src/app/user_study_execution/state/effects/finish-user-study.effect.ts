import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  executionUserStudyCancel, executionUserStudyCancelFailure, executionUserStudyCancelSuccess,
  executionUserStudySubmit, executionUserStudySubmitFailure, executionUserStudySubmitSuccess,
  logAction,
} from '../user-study-execution.actions';
import {logout} from '../../../user/state/user.actions';
import {UserStudyExecutionService} from '../../service/user-study-execution.service';
import { ActionType } from '../../domain/user-action';

@Injectable()
export class FinishUserStudyEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyExecutionService)

    public submitUserStudy$ = createEffect(() => this.actions$.pipe(
        ofType(executionUserStudySubmit),
        switchMap(() => this.service.finish().pipe(
            switchMap(() => [ 
              executionUserStudySubmitSuccess(), 
              logout()]
            ),
            catchError(() => of(executionUserStudySubmitFailure()))
        ))
    ))

  public cancelUserStudy$ = createEffect(() => this.actions$.pipe(
    ofType(executionUserStudyCancel),
    switchMap(() => this.service.cancel().pipe(
      switchMap(() => [executionUserStudyCancelSuccess(), logout()]),
      catchError(() => of(executionUserStudyCancelFailure()))
    ))
  ))
}
