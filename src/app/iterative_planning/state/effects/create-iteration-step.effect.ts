import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { IterationStepService } from "../../service/iteration-step.service";
import { createIterationStep, createIterationStepFailure, createIterationStepSuccess, loadIterationSteps } from "../iterative-planning.actions";
import { selectIterativePlanningNewStep, selectIterativePlanningProject } from "../iterative-planning.selector";

@Injectable()
export class CreateIterationStepEffect{

    private actions$ = inject(Actions)
    private service = inject(IterationStepService)
    private store = inject(Store);

    public createIterationStep$ = createEffect(() => this.actions$.pipe(
        ofType(createIterationStep),
        concatLatestFrom(() => this.store.select(selectIterativePlanningNewStep)),
        switchMap(([, iterationStep]) => this.service.postIterationStep$(iterationStep).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([iterationStep, project]) => [createIterationStepSuccess({iterationStep}), loadIterationSteps({id: project._id})]),
            catchError(() => of(createIterationStepFailure()))
        )),
    ));
}
