import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { SectionExplanationComputationMonitoringService } from "../../services/explanation-computataion-monitoring.service";
import { FlightSectionExplanationService } from "../../services/flight-section-explanation.service";
import { explanationsFinishedFailure, explanationsFinishedSuccess, loadFlightSections, reloadFlightPlanTree, startExplanations, startExplanationsFailure, startExplanationsSuccess } from "../flight-section-planning.actions";

@Injectable()
export class StartExplanationEffect{

    private actions$ = inject(Actions)
    private store = inject(Store);
    private service = inject(FlightSectionExplanationService);
    private monitoringService = inject(SectionExplanationComputationMonitoringService)

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(startExplanations),
        switchMap(({section, configIndex}) => this.service.postExplanationRequest$(section, configIndex).pipe(
            switchMap(section => [startExplanationsSuccess({section, configIndex}), loadFlightSections({treeId: section.treeId})]),
            catchError((e) => of(startExplanationsFailure({err: e})))
        ))
    ));

    public listenExplanationsComputationFinished$ = createEffect(() => this.actions$.pipe(
            ofType(startExplanationsSuccess),
            switchMap(({ section, configIndex}) => {
                return this.monitoringService.explanationComputationFinished$(section._id).pipe(
                    switchMap(() => [
                        explanationsFinishedSuccess({sectionId: section._id, configIndex}),
                        loadFlightSections({treeId: section.treeId}),
                        reloadFlightPlanTree({id: section.treeId})
                    ]),
                    catchError((e) => of(explanationsFinishedFailure({err: e}))),
                )
            })
        ));
}