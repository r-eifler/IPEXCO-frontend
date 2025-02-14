import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { IterationStepService } from "../../service/iteration-step.service";
import { cancelPlanComputationAndIterationStep, cancelPlanComputationAndIterationStepFailure, cancelPlanComputationAndIterationStepSuccess } from "../iterative-planning.actions";

@Injectable()
export class CancelPlanIterationStepEffect{

    private actions$ = inject(Actions)
    private service = inject(IterationStepService)

    public cancelPlanIterationStep$ = createEffect(() => this.actions$.pipe(
        ofType(cancelPlanComputationAndIterationStep),
        switchMap(({iterationStepId}) => this.service.postCancelIterationStep$(iterationStepId).pipe(
            switchMap(() => [cancelPlanComputationAndIterationStepSuccess()]),
            catchError(() => of(cancelPlanComputationAndIterationStepFailure()))
        )),
    ));

}
