import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { EvalInstancesService } from "../../services/plans.service";
import { deleteEvaluationInstance, deleteEvaluationInstanceFailure, deleteEvaluationInstanceSuccess, uploadEvaluationInstance, uploadEvaluationInstanceFailure, uploadEvaluationInstanceSuccess } from "../competition_evaluation.actions";

@Injectable()
export class DeleteEvaluationInstancesEffect{

    private actions$ = inject(Actions);
    private service = inject(EvalInstancesService);

    public uploadPlans$ = createEffect(() => this.actions$.pipe(
        ofType(deleteEvaluationInstance),
        switchMap(({id}) => this.service.deletePlan$(id).pipe(
            switchMap(() => [deleteEvaluationInstanceSuccess()]),
            catchError((e) => of(deleteEvaluationInstanceFailure({ err: e }))),
        ))
    ))

}