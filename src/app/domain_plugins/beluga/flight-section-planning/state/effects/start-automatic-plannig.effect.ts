import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";
import { FlightSectionPlanService } from "../../services/flight-section-plan.service";
import { automaticPlanningFinishedFailure, automaticPlanningFinishedSuccess, loadFlightSections, reloadFlightPlanTree, startAutomaticPlanning, startAutomaticPlanningFailure, startAutomaticPlanningSuccess } from "../flight-section-planning.actions";
import { selectTask } from "../flight-section-planning.selector";
import { SectionPlanComputationMonitoringService } from "../../services/plan-computataion-monitoring.service";

@Injectable()
export class StartAutomaticPlanningEffect{

    private actions$ = inject(Actions)
    private store = inject(Store);
    private service = inject(FlightSectionPlanService);
    private monitoringService = inject(SectionPlanComputationMonitoringService)

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(startAutomaticPlanning),
        switchMap(({section, method}) => this.service.postPlanRequest$(section, method).pipe(
            switchMap(section => [startAutomaticPlanningSuccess({section}), loadFlightSections({treeId: section.treeId})]),
            catchError((e) => of(startAutomaticPlanningFailure({err: e})))
        ))
    ));

    public listenPlanComputationFinished$ = createEffect(() => this.actions$.pipe(
            ofType(startAutomaticPlanningSuccess),
            switchMap(({ section }) => {
                return this.monitoringService.planComputationFinished$(section._id).pipe(
                    switchMap(() => [
                        automaticPlanningFinishedSuccess({id: section._id}),
                        loadFlightSections({treeId: section.treeId}),
                        reloadFlightPlanTree({id: section.treeId})
                    ]),
                    catchError((e) => of(automaticPlanningFinishedFailure({err: e}))),
                )
            })
        ));
}