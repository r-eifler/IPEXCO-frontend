import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { PlanningPlansService } from "../../service/plans.service";
import { cancelPlanComputation, cancelPlanComputationFailure, cancelPlanComputationSuccess } from "../planning.actions";

@Injectable()
export class CancelPlanComputationEffect{

    private actions$ = inject(Actions)
    private service = inject(PlanningPlansService)

    public postPlan$ = createEffect(() => this.actions$.pipe(
        ofType(cancelPlanComputation),
        switchMap(({id}) => this.service.postCancel$(id).pipe(
            switchMap(canceled => [cancelPlanComputationSuccess({canceled})]),
            catchError((e) => of(cancelPlanComputationFailure({ err: e }))),
        ))
    ))

}