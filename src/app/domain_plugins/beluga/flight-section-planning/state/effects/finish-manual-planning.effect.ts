import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { switchMap, tap } from "rxjs";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { finishManualPlanning, finishManualPlanningFailure, updateFlightSection } from "../flight-section-planning.actions";
import { selectProject, selectSelectedSection } from "../flight-section-planning.selector";


@Injectable()
export class FinishManualPlanningEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private router = inject(Router);

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(finishManualPlanning),
        tap(console.log),
        concatLatestFrom(() => [this.store.select(selectSelectedSection), this.store.select(selectProject)]),
        switchMap(([{actions}, section, project]) => {
            if(actions !== undefined &&  section !== undefined && project !== undefined){
                this.router.navigate(["beluga/flight-section-planning/" + project._id + "/flight-sections"])
                return [
                    updateFlightSection({section:{
                        ...section,
                        actions,
                        finished: true,
                        status: PlanRunStatus.SOLVED,
                    }}),
                ]
            }
            return [finishManualPlanningFailure({err: {message: "Task or section not available"}})]
        })
        
    ))
}