import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { createPlanProperty, createPlanPropertyFailure, createPlanPropertySuccess, loadPlanProperties} from "../iterative-planning.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { PlanPropertyService } from "../../service/plan-properties.service";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterativePlanningProject } from "../iterative-planning.selector";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";

@Injectable()
export class CreatePlanPropertyEffect{

    private actions$ = inject(Actions)
    private service = inject(PlanPropertyService)
    private store = inject(Store);

    public createPlanProperty$ = createEffect(() => this.actions$.pipe(
        ofType(createPlanProperty),
        switchMap(({planProperty}) => this.service.postPlanProperty$(planProperty).pipe(
            switchMap((planProperty) => [createPlanPropertySuccess({planProperty})]),
            catchError(() => of(createPlanPropertyFailure()))
        ))
    ));

}