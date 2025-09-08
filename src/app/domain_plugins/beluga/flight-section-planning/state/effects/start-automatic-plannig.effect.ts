import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { FlightsHorizonPlanService } from "../../services/flight-section-plan.service";
import { SectionPlanComputationMonitoringService } from "../../services/plan-computataion-monitoring.service";
import { automaticPlanningFinishedFailure, automaticPlanningFinishedSuccess, loadFlightsHorizons, reloadFlightPlanTree, startAutomaticPlanning, startAutomaticPlanningFailure, startAutomaticPlanningSuccess } from "../flight-section-planning.actions";

@Injectable()
export class StartAutomaticPlanningEffect{

    private actions$ = inject(Actions)
    private store = inject(Store);
    private service = inject(FlightsHorizonPlanService);
    private monitoringService = inject(SectionPlanComputationMonitoringService)

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(startAutomaticPlanning),
        switchMap(({section, method}) => this.service.postPlanRequest$(section, method).pipe(
            switchMap(section => [startAutomaticPlanningSuccess({section}), loadFlightsHorizons({treeId: section.treeId})]),
            catchError((e) => of(startAutomaticPlanningFailure({err: e})))
        ))
    ));

    public listenPlanComputationFinished$ = createEffect(() => this.actions$.pipe(
            ofType(startAutomaticPlanningSuccess),
            switchMap(({ section }) => {
                return this.monitoringService.planComputationFinished$(section._id).pipe(
                    switchMap(() => [
                        automaticPlanningFinishedSuccess({id: section._id}),
                        loadFlightsHorizons({treeId: section.treeId}),
                        reloadFlightPlanTree({id: section.treeId})
                    ]),
                    catchError((e) => of(automaticPlanningFinishedFailure({err: e}))),
                )
            })
        ));
}