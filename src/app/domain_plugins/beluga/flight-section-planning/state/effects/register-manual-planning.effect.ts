import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap } from "rxjs";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { registerManualPlanning, selectSection, updateFlightsHorizon } from "../flight-section-planning.actions";


@Injectable()
export class RegisterManualPlanningEffect{

    private actions$ = inject(Actions);

    public register$ = createEffect(() => this.actions$.pipe(
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