import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { PlanPropertyService } from "../../service/plan-properties.service";
import { deletePlanProperty, deletePlanPropertyFailure, deletePlanPropertySuccess } from "../iterative-planning.actions";

@Injectable()
export class DeletePlanPropertyEffect{

    private actions$ = inject(Actions)
    private service = inject(PlanPropertyService)
    private store = inject(Store);

    public deletePlanProperty$ = createEffect(() => this.actions$.pipe(
        ofType(deletePlanProperty),
        switchMap(({id}) => this.service.deletePLanProperty$(id).pipe(
            switchMap((res) => [deletePlanPropertySuccess({res})]),
            catchError((e) => of(deletePlanPropertyFailure({err: e})))
        ))
    ));

}