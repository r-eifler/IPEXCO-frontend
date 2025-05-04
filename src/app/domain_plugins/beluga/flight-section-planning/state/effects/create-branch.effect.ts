import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { createNewBranch, createNewBranchFailure, createNewBranchSuccess, loadFlightSections, reloadFlightPlanTree } from "../flight-section-planning.actions";


@Injectable()
export class CreateFlightPlanTreeBranchEffect{

    private actions$ = inject(Actions)
    private store = inject(Store);
    private service = inject(FlightPlanTreeService)

    public create$ = createEffect(() => this.actions$.pipe(
        ofType(createNewBranch),
        switchMap(({sectionId, name}) => this.service.newBranch$(sectionId, name).pipe(
            switchMap(tree => [
                createNewBranchSuccess({tree}),
                reloadFlightPlanTree({id: tree._id}),
                loadFlightSections({treeId: tree._id})
            ]),
            catchError((e) => of(createNewBranchFailure({err: e})))
        ))
    ))

}