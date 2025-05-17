import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { SectionExplanationComputationMonitoringService } from "../../services/explanation-computataion-monitoring.service";
import { FlightSectionExplanationService } from "../../services/flight-section-explanation.service";
import { explanationsFinishedFailure, explanationsFinishedSuccess, loadFlightSections, reloadFlightPlanTree, startExplanations, startExplanationsFailure, startExplanationsSuccess } from "../flight-section-planning.actions";
import { selectSelectedConfigIndex } from "../flight-section-planning.feature";

@Injectable()
export class StartExplanationEffect{

    private actions$ = inject(Actions)
    private store = inject(Store);
    private service = inject(FlightSectionExplanationService);
    private monitoringService = inject(SectionExplanationComputationMonitoringService)

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(startExplanations),
        concatLatestFrom(() => this.store.select(selectSelectedConfigIndex)),
        switchMap(([{section}, index]) => {
            if(index == undefined){
                return of(startExplanationsFailure({err: "No configuration selected!"}))
            }
            return this.service.postExplanationRequest$(section, index).pipe(
            switchMap(section => [startExplanationsSuccess({section}), loadFlightSections({treeId: section.treeId})]),
            catchError((e) => of(startExplanationsFailure({err: e})))
        )})
    ));

    public listenExplanationsComputationFinished$ = createEffect(() => this.actions$.pipe(
            ofType(startExplanationsSuccess),
            switchMap(({ section }) => {
                return this.monitoringService.explanationComputationFinished$(section._id).pipe(
                    switchMap(() => [
                        explanationsFinishedSuccess({id: section._id}),
                        loadFlightSections({treeId: section.treeId}),
                        reloadFlightPlanTree({id: section.treeId})
                    ]),
                    catchError((e) => of(explanationsFinishedFailure({err: e}))),
                )
            })
        ));
}