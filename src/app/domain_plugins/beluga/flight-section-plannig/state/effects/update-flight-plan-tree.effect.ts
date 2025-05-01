import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { updateFlightPlanTree, updateFlightPlanTreeFailure, updateFlightPlanTreeSuccess } from "../flight-section-planning.actions";

@Injectable()
export class UpdateFlightPlanTreeEffect{

    private actions$ = inject(Actions)
    private service = inject(FlightPlanTreeService)

    public update$ = createEffect(() => this.actions$.pipe(
        ofType(updateFlightPlanTree),
        switchMap(({tree}) => this.service.postTree$(tree).pipe(
            switchMap(tree => [updateFlightPlanTreeSuccess({tree})]),
            catchError((e) => of(updateFlightPlanTreeFailure({err: e})))
        ))
    ));
}