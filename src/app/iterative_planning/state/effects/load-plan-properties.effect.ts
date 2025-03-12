import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { createPlanPropertySuccess, deletePlanPropertyFailure, deletePlanPropertySuccess, loadPlanProperties, loadPlanPropertiesFailure, loadPlanPropertiesSuccess } from "../iterative-planning.actions";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectProject } from "src/app/project/state/project.selector";
import { selectIterativePlanningProject } from "../iterative-planning.selector";
import { PlanPropertyService } from "../../service/plan-properties.service";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";

@Injectable()
export class LoadPlanPropertiesEffect{

    private actions$ = inject(Actions)
    private service = inject(PlanPropertyService)

    private store = inject(Store);

    public loadProject$ = createEffect(() => this.actions$.pipe(
        ofType(loadPlanProperties),
        switchMap(({id}) => this.service.getPlanProperties$(id).pipe(
            map(planProperties => loadPlanPropertiesSuccess({planProperties})),
            catchError(() => of(loadPlanPropertiesFailure())),
        ))
    ))

    public reloadProject$ = createEffect(() => this.actions$.pipe(
        ofType(deletePlanPropertySuccess,createPlanPropertySuccess),
        concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
        filterListNotNullOrUndefined(),
        switchMap(([,project]) => [loadPlanProperties({id: project._id})]),
        catchError(() => of(deletePlanPropertyFailure()))
    ));


}