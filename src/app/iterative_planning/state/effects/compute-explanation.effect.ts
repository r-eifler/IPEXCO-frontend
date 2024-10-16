import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { ExplainerMonitoringService } from "../../service/explainer-monitoring.service";
import { ExplainerService } from "../../service/explainer.service";
import { globalExplanationComputationRunningFailure, globalExplanationComputationRunningSuccess, loadIterationSteps, registerGlobalExplanationComputation, registerGlobalExplanationComputationFailure, registerGlobalExplanationComputationSuccess } from "../iterative-planning.actions";
import { selectIterativePlanningProject } from "../iterative-planning.selector";

@Injectable()
export class ComputeExplanationEffect{

    private actions$ = inject(Actions)
    private explainerService = inject(ExplainerService)
    private monitoringService = inject(ExplainerMonitoringService)
    private store = inject(Store);

    public registerGlobalExplanationComputation$ = createEffect(() => this.actions$.pipe(
        ofType(registerGlobalExplanationComputation),
        switchMap(({ iterationStepId }) => this.explainerService.postComputeGlobalExplanation$(iterationStepId).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([_, project]) => [registerGlobalExplanationComputationSuccess({iterationStepId}), loadIterationSteps({id: project._id})]),
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

