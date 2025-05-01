import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { initFlightPlanTree, initFlightPlanTreeFailure, initFlightPlanTreeSuccess, loadFlightPlanTreeSuccess } from "../flight-section-planning.actions";


@Injectable()
export class CreateFlightPlanTreeEffect{

    private actions$ = inject(Actions)
    private service = inject(FlightPlanTreeService)

    public loadProject$ = createEffect(() => this.actions$.pipe(
        ofType(initFlightPlanTree),
        switchMap(({projectId}) => this.service.initTree$(projectId).pipe(
            switchMap(tree => [initFlightPlanTreeSuccess({tree}), loadFlightPlanTreeSuccess({tree})]),
            catchError((e) => of(initFlightPlanTreeFailure({err: e})))
        ))
    ))
}