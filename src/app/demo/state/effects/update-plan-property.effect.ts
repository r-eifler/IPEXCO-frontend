import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DemoPlanPropertyService } from "../../services/plan-properties.service";
import { loadDemoPlanProperties, updatePlanProperty, updatePlanPropertyFailure, updatePlanPropertySuccess } from "../demo.actions";
import { catchError, of, switchMap } from "rxjs";


@Injectable()
export class DemoDemoUpdatePlanPropertyEffect{

    private actions$ = inject(Actions)
    private service = inject(DemoPlanPropertyService)

    public updatePlanProperty$ = createEffect(() => this.actions$.pipe(
        ofType(updatePlanProperty),
        switchMap(({planProperty}) => this.service.putPlanProperty$(planProperty).pipe(
            switchMap(planProperty => [updatePlanPropertySuccess({planProperty}),loadDemoPlanProperties({id: planProperty.project})]),
            catchError(() => of(updatePlanPropertyFailure()))
        ))
    ))
}