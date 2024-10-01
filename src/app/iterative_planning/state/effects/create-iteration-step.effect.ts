import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { createIterationStep, createIterationStepFailure, createIterationStepSuccess, createPlanProperty, createPlanPropertyFailure, createPlanPropertySuccess, loadIterationSteps, loadPlanProperties} from "../iterative-planning.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { PlanPropertyService } from "../../service/plan-properties.service";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterativePlanningProject } from "../iterative-planning.selector";
import { IterationStepService } from "../../service/iteration-step.service";

@Injectable()
export class CreateIterationStepEffect{

    private actions$ = inject(Actions)
    private service = inject(IterationStepService)
    private store = inject(Store);

    public createIterationStep$ = createEffect(() => this.actions$.pipe(
        ofType(createIterationStep),
        switchMap(({iterationStep}) => this.service.postIterationStep$(iterationStep).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([iterationStep, project]) => [createIterationStepSuccess({iterationStep}), loadIterationSteps({id: project._id})]),
            catchError(() => of(createIterationStepFailure()))
        ))
    ))
}