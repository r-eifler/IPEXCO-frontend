import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { switchMap, tap } from "rxjs";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { cancelManualPlanning, cancelManualPlanningFailure, updateFlightSection } from "../builder.actions";
import { selectProject, selectSection } from "../builder.selector";


@Injectable()
export class CancelManualPlanningEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private router = inject(Router);

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(cancelManualPlanning),
        tap(console.log),
        concatLatestFrom(() => [this.store.select(selectSection), this.store.select(selectProject)]),
        switchMap(([_, section, project]) => {
            if(section !== undefined && project !== undefined){
                return [
                    updateFlightSection({section:{
                        ...section,
                        actions: [],
                        status: PlanRunStatus.CANCELED,
                    }}),
                ]
            }
            return [cancelManualPlanningFailure({err: {message: "Task or section not available"}})]
        })
        
    ))
}