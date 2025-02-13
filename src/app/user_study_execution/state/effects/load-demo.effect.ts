import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserStudyExecutionDemoService } from '../../service/user-study-execution-demo.service';
import { loadUserStudyDemo, loadUserStudyDemoFailure, loadUserStudyDemoSuccess, loadUserStudyPlanProperties } from '../user-study-execution.actions';


@Injectable()
export class LoadUserStudyExecutionDemoEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyExecutionDemoService)

    public loadDemos$ = createEffect(() => this.actions$.pipe(
        ofType(loadUserStudyDemo),
        switchMap(({demoId}) => this.service.getDemo$(demoId).pipe(
            switchMap(demo => [loadUserStudyDemoSuccess({demo})]),
            catchError(() => of(loadUserStudyDemoFailure()))
        ))
    ));

    public loadDemosSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(loadUserStudyDemoSuccess),
        switchMap(({demo}) => [loadUserStudyPlanProperties({demoId: demo._id})])
    ));
}
