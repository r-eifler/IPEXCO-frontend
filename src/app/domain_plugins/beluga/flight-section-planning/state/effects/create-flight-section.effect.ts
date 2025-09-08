import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { deriveSuccessor } from "../../domain/flight-section";
import { createFlightsHorizon, createFlightsHorizonFailure, createFlightsHorizonSuccess, createSuccessorFlightsHorizon, loadFlightsHorizons, reloadFlightPlanTree } from "../flight-section-planning.actions";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { selectTask } from "../flight-section-planning.selector";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";


@Injectable()
export class CreateFlightSectionEffect{

    private actions$ = inject(Actions)
    private store = inject(Store);
    private service = inject(FlightPlanTreeService)

    public create$ = createEffect(() => this.actions$.pipe(
        ofType(createFlightsHorizon),
        switchMap(({section}) => this.service.postSection$(section).pipe(
            map(section => createFlightsHorizonSuccess({section})),
            catchError((e) => of(createFlightsHorizonFailure({err: e})))
        ))
    ))

    public createSuccessor$ = createEffect(() => this.actions$.pipe(
        ofType(createSuccessorFlightsHorizon),
        concatLatestFrom(() => this.store.select(selectTask)),
        filterListNotNullOrUndefined(),
        switchMap(([{section, flights, indices}, task]) => {
                let sucSection = deriveSuccessor(section, flights, indices); //TODO
                if(sucSection === undefined){
                    return [createFlightsHorizonFailure({err: {message: "Successor section could not be derived!"}})]
                }
                return this.service.postSection$(sucSection).pipe(
                    switchMap(section => [
                        createFlightsHorizonSuccess({section}),
                        loadFlightsHorizons({treeId: section.treeId}),
                        reloadFlightPlanTree({id: section.treeId})
                    ]),
                    catchError((e) => of(createFlightsHorizonFailure({err: e})))
                )
            })
        ))
}