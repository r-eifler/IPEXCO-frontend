import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { switchMap, tap } from "rxjs";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { BelugaActionType, SwitchBeluga } from "../../../shared/domain/beluga_plan";
import { finishManualPlanning, finishManualPlanningFailure, updateFlightSection } from "../builder.actions";
import { selectProject, selectSection } from "../builder.selector";


@Injectable()
export class FinishManualPlanningEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private router = inject(Router);

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(finishManualPlanning),
        tap(console.log),
        concatLatestFrom(() => [this.store.select(selectSection), this.store.select(selectProject)]),
        switchMap(([{actions}, section, project]) => {
            if(actions !== undefined &&  section !== undefined && project !== undefined){
                return [
                    updateFlightSection({section:{
                        ...section,
                        actions: [...actions, {name: BelugaActionType.SWITCH_TO_NEXT_BELUGA} as SwitchBeluga],
                        finished: true,
                        status: PlanRunStatus.SOLVED,
                    }}),
                ]
            }
            return [finishManualPlanningFailure({err: {message: "Task or section not available"}})]
        })
        
    ))
}