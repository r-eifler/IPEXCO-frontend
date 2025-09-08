import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { loadFlightsHorizons, loadFlightsHorizonsFailure, loadFlightsHorizonsSuccess } from "../flight-section-planning.actions";

@Injectable()
export class LoadFlightSectionsEffect{

    private actions$ = inject(Actions)
    private service = inject(FlightPlanTreeService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadFlightsHorizons),
        switchMap(({treeId}) => this.service.getSections$(treeId).pipe(
            map(sections => loadFlightsHorizonsSuccess({sections})),
            catchError((e) => of(loadFlightsHorizonsFailure({err: e})))
        ))
    ))
}