import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { updateFlightPlanTree, updateFlightPlanTreeFailure, updateFlightPlanTreeSelected, updateFlightPlanTreeSuccess } from "../flight-section-planning.actions";
import { selectTree } from "../flight-section-planning.selector";

@Injectable()
export class UpdateFlightPlanTreeEffect{

    private actions$ = inject(Actions)
    private store = inject(Store);
    private service = inject(FlightPlanTreeService)

    public update$ = createEffect(() => this.actions$.pipe(
        ofType(updateFlightPlanTree),
        switchMap(({tree}) => this.service.putTree$(tree).pipe(
            switchMap(tree => [updateFlightPlanTreeSuccess({tree})]),
            catchError((e) => of(updateFlightPlanTreeFailure({err: e})))
        ))
    ));

    public updateTreeSelected$ = createEffect(() => this.actions$.pipe(
        ofType(updateFlightPlanTreeSelected),
        concatLatestFrom(() => this.store.select(selectTree)),
        filterListNotNullOrUndefined(),
        switchMap(([{id}, tree]) => this.service.putTree$({...tree, selectedSectionId: id}).pipe(
            switchMap(tree => [updateFlightPlanTreeSuccess({tree})]),
            catchError((e) => of(updateFlightPlanTreeFailure({err: e})))
        ))
    ));
}