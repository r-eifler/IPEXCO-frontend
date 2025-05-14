import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, of, switchMap } from "rxjs";
import { cancelAutomaticPlanning, cancelAutomaticPlanningFailure, cancelAutomaticPlanningSuccess, loadFlightPlanTree, loadFlightSections } from "../flight-section-planning.actions";
import { FlightSectionPlanService } from "../../services/flight-section-plan.service";


@Injectable()
export class CancelAutomaticPlanningEffect{

    private actions$ = inject(Actions);
    private service = inject(FlightSectionPlanService);

    public cancel$ = createEffect(() => this.actions$.pipe(
        ofType(cancelAutomaticPlanning),
        switchMap(({section}) => this.service.cancel$(section._id).pipe(
            switchMap(_ => [cancelAutomaticPlanningSuccess(), loadFlightSections({treeId: section.treeId})] ),
            catchError((err) => of(cancelAutomaticPlanningFailure(err)))
        ))
    ));
}