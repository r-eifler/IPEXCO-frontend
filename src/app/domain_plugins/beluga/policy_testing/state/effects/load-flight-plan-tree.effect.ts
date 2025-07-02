import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { TestingFlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { loadFlightPlanTree, loadFlightPlanTreeFailure, loadFlightPlanTreeSuccess, loadFlightSections } from "../policy-testing.actions";
import { selectProject } from "../policy-testing.selector";

@Injectable()
export class LoadFlightPlanTreeEffect{

    private actions$ = inject(Actions)
    private service = inject(TestingFlightPlanTreeService)
    private store = inject(Store);

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadFlightPlanTree),
        switchMap(({projectId}) => this.service.getTree$(projectId).pipe(
            switchMap(tree => [
                loadFlightPlanTreeSuccess({tree}),
                loadFlightSections({treeId: tree._id})
            ]),
            catchError((e) => of(loadFlightPlanTreeFailure({err: e}))),
        ))
    ))
}