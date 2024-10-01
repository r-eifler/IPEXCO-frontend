import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { loadIterationSteps, loadIterationStepsFailure, loadIterationStepsSuccess } from "../iterative-planning.actions";
import { Store } from "@ngrx/store";
import { IterationStepService } from "../../service/iteration-step.service";

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

}