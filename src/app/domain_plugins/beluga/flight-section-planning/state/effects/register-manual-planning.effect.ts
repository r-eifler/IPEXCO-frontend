import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { switchMap, tap } from "rxjs";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { selectSection, registerManualPlanning, startManualPlanningFailure, updateFlightSection } from "../flight-section-planning.actions";
import { selectProject, selectTask } from "../flight-section-planning.selector";


@Injectable()
export class RegisterManualPlanningEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private router = inject(Router);

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(registerManualPlanning),
        tap(console.log),
        concatLatestFrom(() => [this.store.select(selectTask), this.store.select(selectProject)]),
        switchMap(([{section, method}, task, project]) => {
            if(task !== undefined &&  section.startState !== undefined && project !== undefined){
                this.router.navigate(["beluga/flight-section-planning/" + project._id + "/planning/manual/section/" + section._id])
                return [
                    selectSection({id: section._id}),
                    updateFlightSection({section: {
                        ...section,
                        planMethod: method,
                        status: PlanRunStatus.RUNNING
                    }})
                ]
            }
            return [startManualPlanningFailure({err: {message: "Task or section not available"}})]
        })
        
    ))
}