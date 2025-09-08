import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { switchMap, tap } from "rxjs";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { selectSection, registerManualPlanning, startManualPlanningFailure, updateFlightsHorizon } from "../flight-section-planning.actions";
import { selectProject, selectTask } from "../flight-section-planning.selector";


@Injectable()
export class RegisterManualPlanningEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private router = inject(Router);

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(registerManualPlanning),
        switchMap(({section, method}) => [
                selectSection({id: section._id}),
                updateFlightsHorizon({section: 
                    {
                        ...section,
                        planMethod: method,
                        status: PlanRunStatus.RUNNING
                    }
                })
            ]
        )
        
    ))
}