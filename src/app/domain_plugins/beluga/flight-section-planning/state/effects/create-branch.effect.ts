import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { createNewBranch, createNewBranchFailure, createNewBranchSuccess, loadFlightsHorizons, reloadFlightPlanTree } from "../flight-section-planning.actions";
import { selectFlights } from "../flight-section-planning.selector";
import { concatLatestFrom } from "@ngrx/operators";


@Injectable()
export class CreateFlightPlanTreeBranchEffect{

    private actions$ = inject(Actions)
    private store = inject(Store);
    private service = inject(FlightPlanTreeService)

    public create$ = createEffect(() => this.actions$.pipe(
        ofType(createNewBranch),
        concatLatestFrom(() => [this.store.select(selectFlights)]),
        switchMap(([{section, name, prefix, horizon}, flights]) => this.service.newBranch$(section, name, flights, prefix, horizon).pipe(
            switchMap(tree => {
                if(tree === undefined){
                    return [createNewBranchFailure({err: "Flight horizon section creation failed"})]
                }
                return [
                    createNewBranchSuccess({tree}),
                    reloadFlightPlanTree({id: tree._id}),
                    loadFlightsHorizons({treeId: tree._id})
                ]
            }),
            catchError((e) => of(createNewBranchFailure({err: e})))
        ))
    ))

}