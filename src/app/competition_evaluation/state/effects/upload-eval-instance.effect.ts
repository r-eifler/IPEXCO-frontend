import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { EvalInstancesService } from "../../services/plans.service";
import { uploadEvaluationInstance, uploadEvaluationInstanceFailure, uploadEvaluationInstanceSuccess } from "../competition_evaluation.actions";

@Injectable()
export class UploadEvaluationInstancesEffect{

    private actions$ = inject(Actions);
    private service = inject(EvalInstancesService);

    public uploadPlans$ = createEffect(() => this.actions$.pipe(
        ofType(uploadEvaluationInstance),
        switchMap(({evalInstance}) => this.service.postPlan$(evalInstance).pipe(
            switchMap(evalInstance => [uploadEvaluationInstanceSuccess({evalInstance})]),
            catchError((e) => of(uploadEvaluationInstanceFailure({ err: e }))),
        ))
    ))

}