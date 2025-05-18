import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { loadFlightSections, saveConfiguration, updateFlightSection, updateFlightSectionFailure, updateFlightSectionSuccess, useConfiguration } from "../flight-section-planning.actions";
import { selectUpdatedConfiguration } from "../flight-section-planning.feature";
import { selectProject, selectSelectedSection } from "../flight-section-planning.selector";
import { Router } from "@angular/router";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";

@Injectable()
export class UpdateFlightSectionEffect{

    private actions$ = inject(Actions)
    private service = inject(FlightPlanTreeService)
    private store = inject(Store);
    private router = inject(Router);

    public update$ = createEffect(() => this.actions$.pipe(
        ofType(updateFlightSection),
        switchMap(({section}) => this.service.putSection$(section).pipe(
            switchMap(section => [updateFlightSectionSuccess({section}), loadFlightSections({treeId: section.treeId})]),
            catchError((e) => of(updateFlightSectionFailure({err: e})))
        ))
    ));

    public saveNewConfiguration$ = createEffect(() => this.actions$.pipe(
        ofType(saveConfiguration),
        concatLatestFrom(() => [this.store.select(selectSelectedSection), this.store.select(selectUpdatedConfiguration)]),
        switchMap(([_, section, configuration]) => {
            if(section === undefined || configuration === null){
                return of(updateFlightSectionFailure({err: "Section or configuration undefined"}))
            }
            return this.service.addConfiguration$(section, configuration).pipe(
            switchMap(section => {
                return [updateFlightSectionSuccess({section}), loadFlightSections({treeId: section.treeId})] 
            }),
            catchError((e) => of(updateFlightSectionFailure({err: e})))
        )})
    ));


    public useConfiguration$ = createEffect(() => this.actions$.pipe(
        ofType(useConfiguration),
        concatLatestFrom(() => [this.store.select(selectSelectedSection)]),
        switchMap(([{index}, section,]) => {
            if(section === undefined || section.status !== PlanRunStatus.PENDING){
                return of(updateFlightSectionFailure({err: "Section or configuration undefined"}))
            }
            return this.service.changeUsedConfiguration$(section, index).pipe(
            switchMap(section => {
                return [updateFlightSectionSuccess({section}), loadFlightSections({treeId: section.treeId})] 
            }),
            catchError((e) => of(updateFlightSectionFailure({err: e})))
        )})
    ));
}

