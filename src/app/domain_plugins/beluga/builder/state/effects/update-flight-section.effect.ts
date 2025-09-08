import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { updateFlightsHorizon, updateFlightsHorizonFailure, updateFlightsHorizonSuccess } from "../builder.actions";

@Injectable()
export class UpdateFlightSectionEffect{

    private actions$ = inject(Actions)
    private service = inject(FlightPlanTreeService)

    public update$ = createEffect(() => this.actions$.pipe(
        ofType(updateFlightsHorizon),
        switchMap(({section}) => this.service.putSection$(section).pipe(
            switchMap(section => [updateFlightsHorizonSuccess({section})]),
            catchError((e) => of(updateFlightsHorizonFailure({err: e})))
        ))
    ));
}