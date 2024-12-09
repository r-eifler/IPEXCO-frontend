import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {ExecutionUserStudyService} from '../../service/execution-user-study.service';
import {executionLoadUserStudy, executionLoadUserStudyFailure, executionLoadUserStudySuccess} from '../user-study-execution.actions';


@Injectable()
export class ExecutionLoadUserStudyEffect{

    private actions$ = inject(Actions)
    private service = inject(ExecutionUserStudyService)

    public loadUserStudy$ = createEffect(() => this.actions$.pipe(
        ofType(executionLoadUserStudy),
        switchMap(({id}) => this.service.getUserStudy$(id).pipe(
            map(userStudy => executionLoadUserStudySuccess({userStudy})),
            catchError(() => of(executionLoadUserStudyFailure()))
        ))
    ))
}
