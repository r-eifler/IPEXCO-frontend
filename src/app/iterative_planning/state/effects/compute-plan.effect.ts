import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";
import { PlannerMonitoringService } from "../../service/planner-monitoring.service";
import { PlannerService } from "../../service/planner.service";
import { createIterationStepFailure, createIterationStepSuccess, planComputationRunningFailure, planComputationRunningSuccess, registerPlanComputation, registerPlanComputationFailure, registerPlanComputationSuccess } from "../iterative-planning.actions";
import { selectIterativePlanningProject, selectIterativePlanningSelectedStepId } from "../iterative-planning.selector";

@Injectable()
export class ComputePlanEffect{

    private actions$ = inject(Actions)
    private plannerService = inject(PlannerService)
    private monitoringService = inject(PlannerMonitoringService)
    private store = inject(Store);

    public registerPlanComputation$ = createEffect(() => this.actions$.pipe(
        ofType(registerPlanComputation),
        concatLatestFrom(() => this.store.select(selectIterativePlanningSelectedStepId)),
        filterListNotNullOrUndefined(),
        switchMap(([_,iterationStepId]) => this.plannerService.postComputePlan$(iterationStepId).pipe(
            switchMap(() => [registerPlanComputationSuccess({iterationStepId})]),
            catchError((e) => of(createIterationStepFailure({err: e})))
        ))
    ))

    computePlanOnIterationStepSuccess$ = createEffect(() => this.actions$.pipe(
      ofType(createIterationStepSuccess),
      switchMap(({iterationStep: { _id: iterationStepId }}) => this.plannerService.postComputePlan$(iterationStepId).pipe(
          concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
          switchMap(() => [registerPlanComputationSuccess({iterationStepId})]),
          catchError((e) => of(registerPlanComputationFailure({err: e})))
      )),
    ));

    public listenPlanComputationFinished$ = createEffect(() => this.actions$.pipe(
        ofType(registerPlanComputationSuccess),
        concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
        filterListNotNullOrUndefined(),
        switchMap(([iterationStepId, {_id: projectId}]) => {
            return this.monitoringService.planComputationFinished$(projectId).pipe(
                switchMap(() => [planComputationRunningSuccess(iterationStepId)]),
                catchError((e) => of(planComputationRunningFailure({err: e}))),
            )
        })
    ));

}

