import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { map, tap } from "rxjs";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { PlanMethodType } from "../../domain/plan_method";
import { selectProject, selectSelectedSection } from "../flight-section-planning.selector";


@Injectable()
export class StartManualPlanningEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private router = inject(Router);

    public start$ = createEffect(() => this.store.select(selectSelectedSection).pipe(
        tap(() => console.log("Effect check start manual planning")),
        concatLatestFrom(() => [this.store.select(selectProject)]),
        map(([section, project]) => {
            if(section?.siteState !== undefined && project !== undefined){
                if(section.status == PlanRunStatus.RUNNING && section.planMethod?.type == PlanMethodType.MANUAL){
                    this.router.navigate(["beluga/flight-section-planning/" + project._id + "/planning/manual/section/" + section._id])
                }
            }
        })
        
    ), {dispatch: false});
}