import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadPlanProperties, updatePlanProperty, updatePlanPropertyFailure, updatePlanPropertySuccess} from "../iterative-planning.actions";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { PlanPropertyService } from "../../service/plan-properties.service";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterativePlanningProject } from "../iterative-planning.selector";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";

@Injectable()
export class UpdatePlanPropertyEffect{

    private actions$ = inject(Actions)
    private service = inject(PlanPropertyService)
    private store = inject(Store);

    public updatePlanProperty$ = createEffect(() => this.actions$.pipe(
        ofType(updatePlanProperty),
        switchMap(({planProperty}) => this.service.putPlanProperty$(planProperty).pipe(
            switchMap((planProperty) => [updatePlanPropertySuccess({planProperty})]),
            catchError(() => of(updatePlanPropertyFailure()))
        ))
    ))

    public updatePlanPropertySuccess$ = createEffect(() => this.actions$.pipe(
        ofType(updatePlanPropertySuccess),
        concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
        filterListNotNullOrUndefined(),
        switchMap(([_, project]) => [loadPlanProperties({id: project._id})]),
        catchError(() => of(updatePlanPropertyFailure()))
    ))
}