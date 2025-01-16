import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, filter, switchMap, tap } from "rxjs/operators";
import { IterationStepService } from "../../service/iteration-step.service";
import { createIterationStep, createIterationStepFailure, createIterationStepSuccess, loadIterationSteps } from "../iterative-planning.actions";
import { selectIterativePlanningCreatedStepId, selectIterativePlanningProject } from "../iterative-planning.selector";
import { ActivatedRoute, Router } from "@angular/router";
import { selectIsUserStudy } from "src/app/user/state/user.selector";
import { selectExecutionUserStudy } from "src/app/user_study_execution/state/user-study-execution.selector";

@Injectable()
export class CreateIterationStepEffect{

    private actions$ = inject(Actions);
    private service = inject(IterationStepService);
    private store = inject(Store);
    private router = inject(Router);

    public createIterationStep$ = createEffect(() => this.actions$.pipe(
        ofType(createIterationStep),
        switchMap(({iterationStep}) => this.service.postIterationStep$(iterationStep).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([iterationStep, project]) => [createIterationStepSuccess({iterationStep}), loadIterationSteps({id: project._id})]),
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
            if(isUserStudy || userStudy){
                this.router.navigate(['/user-study-execution',userStudy._id,'step','iterative-planning', project._id,'steps',stepId]);
            }
            else{
                this.router.navigate(['/iterative-planning', project._id, 'steps', stepId]);
            }
        })
    ), {dispatch: false});
}
