import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { map } from "rxjs";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { updateConfiguration } from "../flight-section-planning.actions";
import { selectProject, selectSelectedSection } from "../flight-section-planning.selector";


@Injectable()
export class GoToConfigurationUpdateEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private router = inject(Router);

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(updateConfiguration),
        concatLatestFrom(() => [this.store.select(selectProject), this.store.select(selectSelectedSection)]),
        map(([_, project, section]) => {
            if(section !== undefined && project !== undefined){
                if(section.status == PlanRunStatus.PENDING){
                    this.router.navigate(["beluga/flight-section-planning/" + project._id + "/configuration-update/" + section._id])
                }
            }
        })
        
    ), {dispatch: false});
}