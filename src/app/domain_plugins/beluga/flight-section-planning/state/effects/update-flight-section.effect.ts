import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { loadFlightSections, updateFlightSection, updateFlightSectionFailure, updateFlightSectionSuccess } from "../flight-section-planning.actions";

@Injectable()
export class UpdateFlightSectionEffect{

    private actions$ = inject(Actions)
    private service = inject(FlightPlanTreeService)

    public update$ = createEffect(() => this.actions$.pipe(
        ofType(updateFlightSection),
        switchMap(({section}) => this.service.putSection$(section).pipe(
            switchMap(section => [updateFlightSectionSuccess({section}), loadFlightSections({treeId: section.treeId})]),
            catchError((e) => of(updateFlightSectionFailure({err: e})))
        ))
    ));
}