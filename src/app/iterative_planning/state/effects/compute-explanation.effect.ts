import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { createIterationStepFailure, createIterationStepSuccess, explanationComputationRunningFailure, explanationComputationRunningSuccess, globalExplanationComputationRunningFailure, globalExplanationComputationRunningSuccess, loadIterationSteps, planComputationRunningFailure, planComputationRunningSuccess, registerExplanationComputation, registerExplanationComputationFailure, registerExplanationComputationSuccess, registerGlobalExplanationComputation, registerGlobalExplanationComputationFailure, registerGlobalExplanationComputationSuccess, registerPlanComputation, registerPlanComputationSuccess, registerTempGoalPlanComputation} from "../iterative-planning.actions";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterativePlanningProject, selectIterativePlanningSelectedStepId } from "../iterative-planning.selector";
import { ExplainerService } from "../../service/explainer.service";
import { ExplainerMonitoringService } from "../../service/explainer-monitoring.service";

@Injectable()
export class ComputeExplanationEffect{

    private actions$ = inject(Actions)
    private explainerService = inject(ExplainerService)
    private monitoringService = inject(ExplainerMonitoringService)
    private store = inject(Store);

    public registerExplanationComputation$ = createEffect(() => this.actions$.pipe(
        ofType(registerExplanationComputation),
        concatLatestFrom(() => this.store.select(selectIterativePlanningSelectedStepId)),
        switchMap(([{iterationStepId: id, question},iterationStepId]) => this.explainerService.postComputeExplanation$(iterationStepId, question).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([res, project]) => [registerExplanationComputationSuccess({iterationStepId}), loadIterationSteps({id: project._id})]),
            catchError(() => of(registerExplanationComputationFailure()))
        ))
    ))


    public listenExplanationComputationFinished$ = createEffect(() => this.actions$.pipe(
        ofType(registerExplanationComputationSuccess),
        concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
        switchMap(([_, {_id: projectId}]) => {
            return this.monitoringService.explanationComputationFinished$(projectId).pipe(
                switchMap(() => [explanationComputationRunningSuccess(), loadIterationSteps({id: projectId})]),
                catchError(() => of(explanationComputationRunningFailure())),
            )
        })
    ))


    public registerGlobalExplanationComputation$ = createEffect(() => this.actions$.pipe(
        ofType(registerGlobalExplanationComputation),
        concatLatestFrom(() => this.store.select(selectIterativePlanningSelectedStepId)),
        switchMap(([{iterationStepId: id},iterationStepId]) => this.explainerService.postComputeGlobalExplanation$(iterationStepId).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([res, project]) => [registerGlobalExplanationComputationSuccess({iterationStepId}), loadIterationSteps({id: project._id})]),
            catchError(() => of(registerGlobalExplanationComputationFailure()))
        ))
    ))


    public listenGlobalExplanationComputationFinished$ = createEffect(() => this.actions$.pipe(
        ofType(registerGlobalExplanationComputationSuccess),
        concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
        switchMap(([_, {_id: projectId}]) => {
            return this.monitoringService.globalExplanationComputationFinished$(projectId).pipe(
                switchMap(() => [globalExplanationComputationRunningSuccess(), loadIterationSteps({id: projectId})]),
                catchError(() => of(globalExplanationComputationRunningFailure())),
            )
        })
    ))
}

