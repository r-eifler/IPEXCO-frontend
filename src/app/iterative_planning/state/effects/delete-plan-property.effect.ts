import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { deletePlanProperty, deletePlanPropertyFailure, deletePlanPropertySuccess, loadPlanProperties} from "../iterative-planning.actions";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { PlanPropertyService } from "../../service/plan-properties.service";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterativePlanningProject } from "../iterative-planning.selector";

@Injectable()
export class DeletePlanPropertyEffect{

    private actions$ = inject(Actions)
    private service = inject(PlanPropertyService)
    private store = inject(Store);

    public deletePlanProperty$ = createEffect(() => this.actions$.pipe(
        ofType(deletePlanProperty),
        switchMap(({id}) => this.service.deletePLanProperty$(id).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([res, project]) => [deletePlanPropertySuccess({res}), loadPlanProperties({id: project._id})]),
            catchError(() => of(deletePlanPropertyFailure()))
        ))
    ))
}