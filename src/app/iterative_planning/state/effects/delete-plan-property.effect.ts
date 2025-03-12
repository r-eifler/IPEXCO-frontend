import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { deletePlanProperty, deletePlanPropertyFailure, deletePlanPropertySuccess, loadPlanProperties} from "../iterative-planning.actions";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { PlanPropertyService } from "../../service/plan-properties.service";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterativePlanningProject } from "../iterative-planning.selector";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";

@Injectable()
export class DeletePlanPropertyEffect{

    private actions$ = inject(Actions)
    private service = inject(PlanPropertyService)
    private store = inject(Store);

    public deletePlanProperty$ = createEffect(() => this.actions$.pipe(
        ofType(deletePlanProperty),
        switchMap(({id}) => this.service.deletePLanProperty$(id).pipe(
            switchMap((res) => [deletePlanPropertySuccess({res})]),
            catchError(() => of(deletePlanPropertyFailure()))
        ))
    ));

}