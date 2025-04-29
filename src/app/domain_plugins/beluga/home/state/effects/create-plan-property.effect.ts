import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { PlanPropertyService } from "../../services/plan-properties.service";
import { createPlanProperty, createPlanPropertyFailure, createPlanPropertySuccess } from "../home.actions";

@Injectable()
export class CreatePlanPropertyEffect{

    private actions$ = inject(Actions)
    private service = inject(PlanPropertyService)
    private store = inject(Store);

    public createPlanProperty$ = createEffect(() => this.actions$.pipe(
        ofType(createPlanProperty),
        switchMap(({planProperty}) => this.service.postPlanProperty$(planProperty).pipe(
            switchMap((planProperty) => [createPlanPropertySuccess({planProperty})]),
            catchError((e) => of(createPlanPropertyFailure({err: e})))
        ))
    ));

}