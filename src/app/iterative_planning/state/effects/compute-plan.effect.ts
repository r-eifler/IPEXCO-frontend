import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { createIterationStep, createIterationStepFailure, createIterationStepSuccess, loadIterationSteps, registerPlanComputationSuccess} from "../iterative-planning.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterativePlanningProject } from "../iterative-planning.selector";
import { PlannerService } from "../../service/planner.service";

@Injectable()
export class ComputePlanEffect{

    private actions$ = inject(Actions)
    private service = inject(PlannerService)
    private store = inject(Store);

    public createIterationStep$ = createEffect(() => this.actions$.pipe(
        ofType(registerPlanComputationSuccess),
        switchMap(({iterationStepId}) => this.service.postComputePlan$(iterationStepId).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([res, project]) => [registerPlanComputationSuccess({iterationStepId}), loadIterationSteps({id: project._id})]),
            catchError(() => of(createIterationStepFailure()))
        ))
    ))
}