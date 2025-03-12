import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { PlanningPlansService } from "../../service/plans.service";
import { planComputationFinishedFailure, planComputationFinishedSuccess, registerPlanComputation, registerPlanComputationFailure, registerPlanComputationSuccess } from "../planning.actions";
import { concatLatestFrom } from "@ngrx/operators";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";
import { PlanComputationMonitoringService } from "../../service/plan-computataion-monitoring.service";

@Injectable()
export class RegisterPlanComputationEffect{

    private actions$ = inject(Actions)
    private service = inject(PlanningPlansService)
    private monitoringService = inject(PlanComputationMonitoringService);

    public postPlan$ = createEffect(() => this.actions$.pipe(
        ofType(registerPlanComputation),
        switchMap(({plan}) => this.service.postPlan$(plan).pipe(
            switchMap(plan => [registerPlanComputationSuccess({plan})]),
            catchError((e) => of(registerPlanComputationFailure({ err: e }))),
        ))
    ))

    public listenPlanComputationFinished$ = createEffect(() => this.actions$.pipe(
            ofType(registerPlanComputationSuccess),
            switchMap(({ plan }) => {
                return this.monitoringService.planComputationFinished$(plan.project).pipe(
                    switchMap(() => [planComputationFinishedSuccess({id: plan._id})]),
                    catchError((e) => of(planComputationFinishedFailure({err: e}))),
                )
            })
        ));

}