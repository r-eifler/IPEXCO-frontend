import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, of, switchMap } from "rxjs";
import { FlightsHorizonPlanService } from "../../services/flight-section-plan.service";
import { cancelAutomaticPlanning, cancelAutomaticPlanningFailure, cancelAutomaticPlanningSuccess, loadFlightsHorizons } from "../flight-section-planning.actions";


@Injectable()
export class CancelAutomaticPlanningEffect{

    private actions$ = inject(Actions);
    private service = inject(FlightsHorizonPlanService);

    public cancel$ = createEffect(() => this.actions$.pipe(
        ofType(cancelAutomaticPlanning),
        switchMap(({section}) => this.service.cancel$(section._id).pipe(
            switchMap(_ => [cancelAutomaticPlanningSuccess(), loadFlightsHorizons({treeId: section.treeId})] ),
            catchError((err) => of(cancelAutomaticPlanningFailure(err)))
        ))
    ));
}