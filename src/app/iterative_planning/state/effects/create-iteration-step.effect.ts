import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, filter, switchMap, tap } from "rxjs/operators";
import { selectIsUserStudy } from "src/app/user/state/user.selector";
import { selectExecutionUserStudy } from "src/app/user_study_execution/state/user-study-execution.selector";
import { IterationStepService } from "../../service/iteration-step.service";
import { createIterationStep, createIterationStepFailure, createIterationStepSuccess } from "../iterative-planning.actions";
import { selectIterativePlanningCreatedStepId, selectIterativePlanningProject } from "../iterative-planning.selector";

@Injectable()
export class CreateIterationStepEffect{

    private actions$ = inject(Actions);
    private service = inject(IterationStepService);
    private store = inject(Store);
    private router = inject(Router);

    public createIterationStep$ = createEffect(() => this.actions$.pipe(
        ofType(createIterationStep),
        switchMap(({iterationStep}) => this.service.postIterationStep$(iterationStep).pipe(
            switchMap((iterationStep) => [createIterationStepSuccess({iterationStep})]),
            catchError(() => of(createIterationStepFailure()))
        )),
    ));

    public navigateToCreatedIterationStep$ = createEffect(() => this.store.select(selectIterativePlanningCreatedStepId).pipe(
        filter(stepId => !!stepId),
        concatLatestFrom(() => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIsUserStudy),
            this.store.select(selectExecutionUserStudy)
        ]),
        tap(([stepId, project, isUserStudy, userStudy]) => {
            if(project !== undefined){
                if(isUserStudy && userStudy !== undefined){
                    this.router.navigate(['/user-study-execution',userStudy._id,'step','iterative-planning', project._id,'steps',stepId]);
                }
                else{
                    this.router.navigate(['/iterative-planning', project._id, 'steps', stepId]);
                }
            }
        })
    ), {dispatch: false});
}
