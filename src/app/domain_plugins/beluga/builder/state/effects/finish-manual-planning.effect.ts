import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { switchMap } from "rxjs";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { finishManualPlanning, finishManualPlanningFailure, updateFlightSection } from "../builder.actions";
import { selectProject, selectSection, selectTaskState } from "../builder.selector";
import { selectConfig } from "../builder.feature";
import { skipNotDelivered } from "../../domain/schedule_utils";


@Injectable()
export class FinishManualPlanningEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private router = inject(Router);

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(finishManualPlanning),
        concatLatestFrom(() => [this.store.select(selectSection), this.store.select(selectConfig), this.store.select(selectTaskState)]),
        switchMap(([{actions}, section, config, taskState]) => {
            if(actions !== undefined &&  section !== undefined && config !== null && taskState !== undefined && taskState !== null){
                const finalConfig = {
                    ...config,
                    productionLinesTargetSchedule: skipNotDelivered(config.productionLinesTargetSchedule, taskState.productionLines),
                }
                return [
                    updateFlightSection({section:{
                        ...section,
                        actions: actions,
                        configurations: [
                            ...section.configurations,
                            finalConfig,
                        ],
                        configurationIndex: section.configurationIndex + 1,
                        status: PlanRunStatus.SOLVED,
                    }}),
                ]
            }
            return [finishManualPlanningFailure({err: {message: "Task or section not available"}})]
        })
        
    ))
}