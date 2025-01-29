import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ExplainerServicesService } from "../../service/explainer.service";
import { PlannerServicesService } from "../../service/planner.service";
import { deleteExplainer, deleteExplainerFailure, deleteExplainerSuccess, deletePlanner, deletePlannerFailure, deletePlannerSuccess, loadExplainers, loadPlanners } from "../globalSpec.actions";


@Injectable()
export class DeleteServicesEffect{

    private actions$ = inject(Actions)
    private servicePlanner = inject(PlannerServicesService)
    private serviceExplainer = inject(ExplainerServicesService)

    public deletePlanners$ = createEffect(() => this.actions$.pipe(
        ofType(deletePlanner),
        switchMap(({id}) => this.servicePlanner.delete$(id).pipe(
            switchMap(() => [deletePlannerSuccess(), loadPlanners()] ),
            catchError(() => of(deletePlannerFailure()))
        ))
    ));

    public deleteExplainers$ = createEffect(() => this.actions$.pipe(
        ofType(deleteExplainer),
        switchMap(({id}) => this.serviceExplainer.delete$(id).pipe(
            switchMap(() => [deleteExplainerSuccess(), loadExplainers()] ),
            catchError(() => of(deleteExplainerFailure()))
        ))
    ));
}