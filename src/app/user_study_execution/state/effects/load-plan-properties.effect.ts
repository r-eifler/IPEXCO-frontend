import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {switchMap, catchError} from 'rxjs/operators';
import { loadUserStudyPlanProperties, loadUserStudyPlanPropertiesFailure, loadUserStudyPlanPropertiesSuccess } from '../user-study-execution.actions';
import { UserStudyExecutionPlanPropertyService } from '../../service/user-study-execution-plan-properties.service';


@Injectable()
export class LoadUserStudyExecutionPlanPropertiesEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyExecutionPlanPropertyService)

    public loadPlanProperties$ = createEffect(() => this.actions$.pipe(
        ofType(loadUserStudyPlanProperties),
        switchMap(({demoId}) => this.service.getPlanPropertiesList$(demoId).pipe(
            switchMap(planProperties => [loadUserStudyPlanPropertiesSuccess({planProperties})]),
            catchError(() => of(loadUserStudyPlanPropertiesFailure()))
        ))
    ))
}
