import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { switchMap, tap } from "rxjs";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { cancelAutomaticPlanning, cancelPlanning, cancelPlanningFailure, updateFlightsHorizon } from "../flight-section-planning.actions";
import { selectProject } from "../flight-section-planning.selector";
import { PlanMethodType } from "../../domain/plan_method";


@Injectable()
export class CancelPlanningEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(cancelPlanning),
        concatLatestFrom(() => [this.store.select(selectProject)]),
        switchMap(([{section}, project]) => {
            if(section !== undefined && project !== undefined){
                if(section.planMethod?.type == PlanMethodType.MANUAL){
                    return [
                        updateFlightsHorizon({section:{
                            ...section,
                            status: PlanRunStatus.CANCELED,
                        }}),
                    ]
                }
                if(section.planMethod?.type == PlanMethodType.AUTOMATIC_SEARCH_PLANNER){
                    return [
                        cancelAutomaticPlanning({section}),
                    ]
                }
            }
            return [cancelPlanningFailure({err: {message: "section or project not available"}})]
        })
        
    ))
}