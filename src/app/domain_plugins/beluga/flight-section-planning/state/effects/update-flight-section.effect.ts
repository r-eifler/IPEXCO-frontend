import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { loadFlightSections, saveConfiguration, updateFlightSection, updateFlightSectionFailure, updateFlightSectionSuccess } from "../flight-section-planning.actions";
import { selectUpdatedConfiguration } from "../flight-section-planning.feature";
import { selectProject, selectSelectedSection } from "../flight-section-planning.selector";
import { Router } from "@angular/router";

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
        concatLatestFrom(() => [this.store.select(selectSelectedSection), this.store.select(selectUpdatedConfiguration), this.store.select(selectProject)]),
        switchMap(([_, section, configuration, project]) => {
            if(section === undefined || configuration === null || project === undefined){
                return of(updateFlightSectionFailure({err: "Section or configuration undefined"}))
            }
            return this.service.addConfiguration$(section, configuration).pipe(
            switchMap(section => {
                this.router.navigate(["/beluga/flight-section-planning/" + project._id + "/configuration-explanations/" + section._id + "/" + section.configurationIndex])
                return [updateFlightSectionSuccess({section}), loadFlightSections({treeId: section.treeId})] 
            }),
            catchError((e) => of(updateFlightSectionFailure({err: e})))
        )})
    ));
}

