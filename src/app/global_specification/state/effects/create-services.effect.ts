import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ExplainerServicesService } from "../../service/explainer.service";
import { PlannerServicesService } from "../../service/planner.service";
import { createExplainer, createExplainerFailure, createExplainerSuccess, createPlanner, createPlannerFailure, createPlannerSuccess, loadExplainers, loadPlanners } from "../globalSpec.actions";


@Injectable()
export class CreateServicesEffect{

    private actions$ = inject(Actions)
    private servicePlanner = inject(PlannerServicesService)
    private serviceExplainer = inject(ExplainerServicesService)

    public createPlanners$ = createEffect(() => this.actions$.pipe(
        ofType(createPlanner),
        switchMap(({planner}) => this.servicePlanner.post$(planner).pipe(
            switchMap(planner => [createPlannerSuccess({planner: planner}), loadPlanners()] ),
            catchError(() => of(createPlannerFailure()))
        ))
    ));

    public createExplainers$ = createEffect(() => this.actions$.pipe(
        ofType(createExplainer),
        switchMap(({explainer}) => this.serviceExplainer.post$(explainer).pipe(
            switchMap(exp => [createExplainerSuccess({explainer: exp}), loadExplainers()] ),
            catchError(() => of(createExplainerFailure()))
        ))
    ));
}