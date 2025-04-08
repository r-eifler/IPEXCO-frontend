import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { EvalInstancesService } from "../../services/plans.service";
import { loadEvaluationInstances, loadEvaluationInstancesFailure, loadEvaluationInstancesSuccess, uploadEvaluationInstanceSuccess } from "../competition_evaluation.actions";

@Injectable()
export class LoadEvaluationInstancesEffect{

    private actions$ = inject(Actions);
    private service = inject(EvalInstancesService);

    public loadPlans$ = createEffect(() => this.actions$.pipe(
        ofType(loadEvaluationInstances),
        switchMap(() => this.service.getPlans$().pipe(
            switchMap(evalInstances => [loadEvaluationInstancesSuccess({evalInstances})]),
            catchError((e) => of(loadEvaluationInstancesFailure({ err: e }))),
        ))
    ))

    public reloadPlans$ = createEffect(() => this.actions$.pipe(
        ofType(uploadEvaluationInstanceSuccess),
        switchMap(() => this.service.getPlans$().pipe(
            switchMap(evalInstances => [loadEvaluationInstancesSuccess({evalInstances})]),
            catchError((e) => of(loadEvaluationInstancesFailure({ err: e }))),
        ))
    ))
}