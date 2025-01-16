import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { IterationStepService } from "../../service/iteration-step.service";
import { cancelPlanComputationAndIterationStep, cancelPlanComputationAndIterationStepFailure, cancelPlanComputationAndIterationStepSuccess, loadIterationSteps } from "../iterative-planning.actions";
import { selectIterativePlanningProject } from "../iterative-planning.selector";
import { selectIsUserStudy } from "src/app/user/state/user.selector";
import { Router } from "@angular/router";

@Injectable()
export class CancelPlanIterationStepEffect{

    private actions$ = inject(Actions)
    private service = inject(IterationStepService)
    private store = inject(Store);
    private router = inject(Router);

    public cancelPlanIterationStep$ = createEffect(() => this.actions$.pipe(
        ofType(cancelPlanComputationAndIterationStep),
        switchMap(({iterationStepId}) => this.service.postCancelIterationStep$(iterationStepId).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([_, project]) => [cancelPlanComputationAndIterationStepSuccess(), loadIterationSteps({id: project._id})]),
            catchError(() => of(cancelPlanComputationAndIterationStepFailure()))
        )),
    ));


    // public navigateCancelPlanIterationStep$ = createEffect(() => this.actions$.pipe(
    //     ofType(cancelPlanComputationAndIterationStepSuccess),
    //     concatLatestFrom(() => [this.store.select(selectIterativePlanningProject),this.store.select(selectIsUserStudy)]),
    //     tap(([_, project, isUserStudy]) => {
    //         if(isUserStudy){
    //             this.router.navigate(['/user-study-execution','iterative-planning', project._id, 'steps']);
    //         }
    //         else{
    //             this.router.navigate(['/iterative-planning', project._id, 'steps']);
    //         }
    //     })
    //     ), {dispatch: false});
}
