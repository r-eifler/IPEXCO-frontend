import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { initFlightPlanTree, initFlightPlanTreeFailure, initFlightPlanTreeSuccess, loadFlightPlanTreeSuccess, loadFlightsHorizons } from "../flight-section-planning.actions";
import { selectTask } from "../flight-section-planning.selector";
import { Store } from "@ngrx/store";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";


@Injectable()
export class CreateFlightPlanTreeEffect{

    private actions$ = inject(Actions)
    private service = inject(FlightPlanTreeService)
    private store = inject(Store);

    public loadProject$ = createEffect(() => this.actions$.pipe(
        ofType(initFlightPlanTree),
        concatLatestFrom(() => [this.store.select(selectTask)]),
        filterListNotNullOrUndefined(),
        switchMap(([{projectId}, task]) => this.service.initTree$(projectId, task).pipe(
            switchMap(tree => [
                initFlightPlanTreeSuccess({tree}), 
                loadFlightPlanTreeSuccess({tree}),
                loadFlightsHorizons({treeId: tree._id})
            ]),
            catchError((e) => of(initFlightPlanTreeFailure({err: e})))
        ))
    ))
}