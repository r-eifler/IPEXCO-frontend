import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { FlightSectionExplanationService } from "../../services/flight-section-explanation.service";
import { SectionPlanComputationMonitoringService } from "../../services/plan-computataion-monitoring.service";
import { loadFlightSections, startExplanations, startExplanationsFailure, startExplanationsSuccess } from "../flight-section-planning.actions";

@Injectable()
export class StartExplanationEffect{

    private actions$ = inject(Actions)
    private store = inject(Store);
    private service = inject(FlightSectionExplanationService);
    private monitoringService = inject(SectionPlanComputationMonitoringService)

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(startExplanations),
        switchMap(({section}) => this.service.postExplanationRequest$(section).pipe(
            switchMap(section => [startExplanationsSuccess({section}), loadFlightSections({treeId: section.treeId})]),
            catchError((e) => of(startExplanationsFailure({err: e})))
        ))
    ));

    // public listenPlanComputationFinished$ = createEffect(() => this.actions$.pipe(
    //         ofType(startAutomaticPlanningSuccess),
    //         switchMap(({ section }) => {
    //             return this.monitoringService.planComputationFinished$(section._id).pipe(
    //                 switchMap(() => [
    //                     automaticPlanningFinishedSuccess({id: section._id}),
    //                     loadFlightSections({treeId: section.treeId}),
    //                     reloadFlightPlanTree({id: section.treeId})
    //                 ]),
    //                 catchError((e) => of(automaticPlanningFinishedFailure({err: e}))),
    //             )
    //         })
    //     ));
}