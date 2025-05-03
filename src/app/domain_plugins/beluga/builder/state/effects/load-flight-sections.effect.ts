import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { loadFlightSection, loadFlightSectionFailure, loadFlightSectionSuccess } from "../builder.actions";

@Injectable()
export class LoadFlightSectionEffect{

    private actions$ = inject(Actions)
    private service = inject(FlightPlanTreeService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadFlightSection),
        switchMap(({id}) => this.service.getSectionById$(id).pipe(
            map(section => loadFlightSectionSuccess({section})),
            catchError((e) => of(loadFlightSectionFailure({err: e})))
        ))
    ))
}