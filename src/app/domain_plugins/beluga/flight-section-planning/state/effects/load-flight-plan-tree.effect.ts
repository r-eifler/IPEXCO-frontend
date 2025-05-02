import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { loadFlightPlanTree, loadFlightPlanTreeFailure, loadFlightPlanTreeNotNullSuccess, loadFlightPlanTreeSuccess, loadFlightSections, reloadFlightPlanTree, reloadFlightPlanTreeFailure, reloadFlightPlanTreeSuccess } from "../flight-section-planning.actions";

@Injectable()
export class LoadFlightPlanTreeEffect{

    private actions$ = inject(Actions)
    private service = inject(FlightPlanTreeService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadFlightPlanTree),
        switchMap(({projectId}) => this.service.getTree$(projectId).pipe(
            switchMap(tree => {
                const actions: Action[] = [loadFlightPlanTreeSuccess({tree})];
                if(tree !== null){
                    actions.push(loadFlightPlanTreeNotNullSuccess({tree}));
                }
                return actions;
            }),
            catchError((e) => of(loadFlightPlanTreeFailure({err: e}))),
        ))
    ))

    public reload$ = createEffect(() => this.actions$.pipe(
        ofType(reloadFlightPlanTree),
        switchMap(({id}) => this.service.getTreeById$(id).pipe(
            switchMap(tree => [reloadFlightPlanTreeSuccess({tree})]),
            catchError((e) => of(reloadFlightPlanTreeFailure({err: e}))),
        ))
    ))


    public loadSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(loadFlightPlanTreeNotNullSuccess),
        switchMap(({tree}) => [
            loadFlightSections({treeId: tree?._id})
        ]),
    ));
}