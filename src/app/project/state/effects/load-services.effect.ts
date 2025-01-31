import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectPlannerServicesService } from "../../service/planner.service";
import { ProjectExplainerServicesService } from "../../service/explainer.service";
import { loadExplainers, loadExplainersFailure, loadExplainersSuccess, loadPlanners, loadPlannersFailure, loadPlannersSuccess } from "../project.actions";




@Injectable()
export class ProjectLoadServicesEffect{

    private actions$ = inject(Actions)
    private servicePlanner = inject(ProjectPlannerServicesService)
    private serviceExplainer = inject(ProjectExplainerServicesService)

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