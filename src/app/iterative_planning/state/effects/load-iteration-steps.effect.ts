import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { cancelPlanComputationAndIterationStepSuccess, createIterationStepSuccess, globalExplanationComputationRunningSuccess, loadIterationSteps, loadIterationStepsFailure, loadIterationStepsSuccess, planComputationRunningFailure, planComputationRunningSuccess, registerGlobalExplanationComputationSuccess, registerPlanComputationSuccess } from "../iterative-planning.actions";
import { Store } from "@ngrx/store";
import { IterationStepService } from "../../service/iteration-step.service";
import { selectIterativePlanningProject } from "../iterative-planning.selector";
import { concatLatestFrom } from "@ngrx/operators";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";

@Injectable()
export class LoadIterationStepsEffect{

    private actions$ = inject(Actions)
    private service = inject(IterationStepService)

    private store = inject(Store);

    public loadIterationStep$ = createEffect(() => this.actions$.pipe(
        ofType(loadIterationSteps),
        switchMap(({id}) => this.service.getIterationSteps$(id).pipe(
            map(iterationSteps => loadIterationStepsSuccess({iterationSteps})),
            catchError(() => of(loadIterationStepsFailure())),
        ))
    ))

    public reloadIterationStep$ = createEffect(() => this.actions$.pipe(
        ofType(
            createIterationStepSuccess,
            planComputationRunningSuccess,
            registerPlanComputationSuccess,
            globalExplanationComputationRunningSuccess,
            registerGlobalExplanationComputationSuccess,
            cancelPlanComputationAndIterationStepSuccess
        ),
        concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
        filterListNotNullOrUndefined(),
        switchMap(([,project]) => [loadIterationSteps({id: project._id})]),
    ));

}