import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { createIterationStep, createIterationStepFailure, createIterationStepSuccess, loadIterationSteps, planComputationRunningFailure, planComputationRunningSuccess, registerPlanComputation, registerPlanComputationSuccess, registerTempGoalPlanComputation} from "../iterative-planning.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterativePlanningProject, selectIterativePlanningSelectedStepId } from "../iterative-planning.selector";
import { PlannerService } from "../../service/planner.service";
import { PlannerMonitoringService } from "../../service/planner-monitoring.service";

@Injectable()
export class ComputePlanEffect{

    private actions$ = inject(Actions)
    private plannerService = inject(PlannerService)
    private monitoringService = inject(PlannerMonitoringService)
    private store = inject(Store);

    public registerPlanComputation$ = createEffect(() => this.actions$.pipe(
        ofType(registerPlanComputation),
        concatLatestFrom(() => this.store.select(selectIterativePlanningSelectedStepId)),
        switchMap(([_,iterationStepId]) => this.plannerService.postComputePlan$(iterationStepId).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([res, project]) => [registerPlanComputationSuccess({iterationStepId}), loadIterationSteps({id: project._id})]),
            catchError(() => of(createIterationStepFailure()))
        ))
    ))

    public registerTempGoalPlanComputation$ = createEffect(() => this.actions$.pipe(
        ofType(registerTempGoalPlanComputation),
        concatLatestFrom(() => this.store.select(selectIterativePlanningSelectedStepId)),
        switchMap(([_,iterationStepId]) => this.plannerService.postComputePlanTempGoals$(iterationStepId).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([res, project]) => [registerPlanComputationSuccess({iterationStepId}), loadIterationSteps({id: project._id})]),
            catchError(() => of(createIterationStepFailure()))
        ))
    ))

    computePlanOnIterationStepSuccess$ = createEffect(() => this.actions$.pipe(
      ofType(createIterationStepSuccess),
      switchMap(({iterationStep: { _id: iterationStepId }}) => this.plannerService.postComputePlanTempGoals$(iterationStepId).pipe(
          concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
          switchMap(([res, project]) => [registerPlanComputationSuccess({iterationStepId}), loadIterationSteps({id: project._id})]),
          catchError(() => of(createIterationStepFailure()))
      )),
    ));

    public listenPlanComputationFinished$ = createEffect(() => this.actions$.pipe(
        ofType(registerPlanComputationSuccess),
        concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
        switchMap(([_, {_id: projectId}]) => {
            return this.monitoringService.planComputationFinished$(projectId).pipe(
                switchMap(() => [planComputationRunningSuccess(), loadIterationSteps({id: projectId})]),
                catchError(() => of(planComputationRunningFailure())),
            )
        })
    ))
}

