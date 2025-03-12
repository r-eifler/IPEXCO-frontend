import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { createIterationStepFailure, createIterationStepSuccess, loadIterationSteps, planComputationRunningFailure, planComputationRunningSuccess, registerPlanComputationSuccess, registerPlanComputation, registerPlanComputationFailure} from "../iterative-planning.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterativePlanningProject, selectIterativePlanningProperties, selectIterativePlanningSelectedStepId } from "../iterative-planning.selector";
import { PlannerService } from "../../service/planner.service";
import { PlannerMonitoringService } from "../../service/planner-monitoring.service";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";

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
            catchError(() => of(createIterationStepFailure()))
        ))
    ))

    computePlanOnIterationStepSuccess$ = createEffect(() => this.actions$.pipe(
      ofType(createIterationStepSuccess),
      switchMap(({iterationStep: { _id: iterationStepId }}) => this.plannerService.postComputePlan$(iterationStepId).pipe(
          concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
          switchMap(() => [registerPlanComputationSuccess({iterationStepId})]),
          catchError((err) => of(registerPlanComputationFailure()))
      )),
    ));

    public listenPlanComputationFinished$ = createEffect(() => this.actions$.pipe(
        ofType(registerPlanComputationSuccess),
        concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
        filterListNotNullOrUndefined(),
        switchMap(([iterationStepId, {_id: projectId}]) => {
            return this.monitoringService.planComputationFinished$(projectId).pipe(
                switchMap(() => [planComputationRunningSuccess(iterationStepId)]),
                catchError(() => of(planComputationRunningFailure())),
            )
        })
    ));

}

