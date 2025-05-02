import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { createFlightSection, createFlightSectionFailure, createFlightSectionSuccess } from "../flight-section-planning.actions";


@Injectable()
export class CreateFlightSectionEffect{

    private actions$ = inject(Actions)
    private service = inject(FlightPlanTreeService)

    public create$ = createEffect(() => this.actions$.pipe(
        ofType(createFlightSection),
        switchMap(({section}) => this.service.postSection$(section).pipe(
            map(section => createFlightSectionSuccess({section})),
            catchError((e) => of(createFlightSectionFailure({err: e})))
        ))
    ))
}