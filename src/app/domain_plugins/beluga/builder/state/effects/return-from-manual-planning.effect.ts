import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { createEffect } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { map } from "rxjs";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { selectProject, selectSection } from "../builder.selector";


@Injectable()
export class ReturnFromManualPlanningEffect{

    private store = inject(Store);
    private router = inject(Router);

    public return$ = createEffect(() => this.store.select(selectSection).pipe(
        concatLatestFrom(() => [this.store.select(selectProject)]),
        map(([section, project]) => {
            if(section?.startState !== undefined && project !== undefined){
                if(section.status !== PlanRunStatus.RUNNING){
                    console.log("return fum manual planning");
                    this.router.navigate(["beluga/flight-section-planning/" + project._id + "/flight-sections"])
                }
            }
        })
        
    ), {dispatch: false});
}