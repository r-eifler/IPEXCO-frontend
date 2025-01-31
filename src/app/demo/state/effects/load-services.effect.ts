import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { DemoPlannerServicesService } from "../../services/planner.service";
import { DemoExplainerServicesService } from "../../services/explainer.service";
import { loadExplainers, loadExplainersFailure, loadExplainersSuccess, loadPlanners, loadPlannersFailure, loadPlannersSuccess } from "../demo.actions";




@Injectable()
export class DemoLoadServicesEffect{

    private actions$ = inject(Actions)
    private servicePlanner = inject(DemoPlannerServicesService)
    private serviceExplainer = inject(DemoExplainerServicesService)

    public loadPlanners$ = createEffect(() => this.actions$.pipe(
        ofType(loadPlanners),
        switchMap(() => this.servicePlanner.get$().pipe(
            switchMap(planner => [loadPlannersSuccess({planners: planner})] ),
            catchError(() => of(loadPlannersFailure()))
        ))
    ));

    public loadExplainers$ = createEffect(() => this.actions$.pipe(
        ofType(loadExplainers),
        switchMap(() => this.serviceExplainer.get$().pipe(
            switchMap(exp => [loadExplainersSuccess({explainers: exp})] ),
            catchError(() => of(loadExplainersFailure()))
        ))
    ));
}