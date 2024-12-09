import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { deleteIterationStep, deleteIterationStepFailure, deleteIterationStepSuccess, loadIterationSteps } from "../iterative-planning.actions";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterativePlanningProject } from "../iterative-planning.selector";
import { IterationStepService } from "../../service/iteration-step.service";

@Injectable()
export class DeleteIterationEffect{

    private actions$ = inject(Actions)
    private service = inject(IterationStepService)
    private store = inject(Store);

    public deleteIterationStep$ = createEffect(() => this.actions$.pipe(
        ofType(deleteIterationStep),
        switchMap(({id}) => this.service.deleteIterationStep$(id).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([_, project]) => [deleteIterationStepSuccess(), loadIterationSteps({id: project._id})]),
            catchError(() => of(deleteIterationStepFailure()))
        ))
    ))
}