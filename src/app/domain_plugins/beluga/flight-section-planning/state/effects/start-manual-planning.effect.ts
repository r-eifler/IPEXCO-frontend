import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { startManualPlanning, startManualPlanningFailure } from "../flight-section-planning.actions";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { switchMap, tap } from "rxjs";
import { projectTaskToSection } from "../../domain/flight-section";
import { initBuilder } from "../../../builder/state/builder.actions";
import { Router } from "@angular/router";
import { selectProject, selectTask } from "../flight-section-planning.selector";


@Injectable()
export class StartManualPlanningEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private router = inject(Router);

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(startManualPlanning),
        tap(console.log),
        concatLatestFrom(() => [this.store.select(selectTask), this.store.select(selectProject)]),
        switchMap(([{section}, task, project]) => {
            if(task !== undefined &&  section.startState !== undefined && project !== undefined){
                let projection = projectTaskToSection(task, section);
                this.router.navigate(["beluga/flight-section-planning/" + project._id + "/planning/manual/section/" + section._id])
                return [initBuilder({task: projection, initState: section.startState})]
            }
            return [startManualPlanningFailure({err: {message: "Task or section not available"}})]
        })
        
    ))
}