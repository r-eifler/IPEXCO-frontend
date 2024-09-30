import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { createPlanProperty, createPlanPropertyFailure, createPlanPropertySuccess, loadPlanProperties} from "../iterative-planning.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { PlanPropertyService } from "../../service/plan-properties.service";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterativePlanningProject } from "../iterative-planning.selector";

@Injectable()
export class CreatePlanPropertyEffect{

    private actions$ = inject(Actions)
    private service = inject(PlanPropertyService)
    private store = inject(Store);

    public createPlanProperty$ = createEffect(() => this.actions$.pipe(
        ofType(createPlanProperty),
        switchMap(({planProperty}) => this.service.postPlanProperty$(planProperty).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([planProperty, project]) => [createPlanPropertySuccess({planProperty}), loadPlanProperties({id: project._id})]),
            catchError(() => of(createPlanPropertyFailure()))
        ))
    ))
}