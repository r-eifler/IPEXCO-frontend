import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { deleteIterationStep, deleteIterationStepFailure, deleteIterationStepSuccess, loadIterationSteps } from "../iterative-planning.actions";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterativePlanningProject } from "../iterative-planning.selector";
import { IterationStepService } from "../../service/iteration-step.service";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";

@Injectable()
export class DeleteIterationEffect{

    private actions$ = inject(Actions)
    private service = inject(IterationStepService)
    private store = inject(Store);

    public deleteIterationStep$ = createEffect(() => this.actions$.pipe(
        ofType(deleteIterationStep),
        switchMap(({id}) => this.service.deleteIterationStep$(id).pipe(
            switchMap(() => [deleteIterationStepSuccess()]),
            catchError(() => of(deleteIterationStepFailure()))
        ))
    ));

    public deleteIterationStepSucess$ = createEffect(() => this.actions$.pipe(
        ofType(deleteIterationStepSuccess),
        concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
        filterListNotNullOrUndefined(),
        switchMap(([_, project]) => [loadIterationSteps({id: project._id})]),
        catchError(() => of(deleteIterationStepFailure()))
    ));
}