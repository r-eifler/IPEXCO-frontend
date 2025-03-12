import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { combineLatest, of } from "rxjs";
import { catchError, combineLatestWith, switchMap } from "rxjs/operators";
import { PlanningPlansService } from "../../service/plans.service";
import { cancelPlanComputationSuccess, loadPlans, loadPlansSuccess, loadProjectFailure, planComputationFinishedSuccess, registerPlanComputationSuccess } from "../planning.actions";
import { Store } from "@ngrx/store";
import { selectProject } from "../planning.selector";
import { concatLatestFrom } from "@ngrx/operators";
import { filterListNotNullOrUndefined, filterNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";

@Injectable()
export class LoadPlanningPlansEffect{

    private actions$ = inject(Actions);
    private service = inject(PlanningPlansService);
    private store = inject(Store);

    public loadPlans$ = createEffect(() => this.actions$.pipe(
        ofType(loadPlans),
        switchMap(({id}) => this.service.getPlans$(id).pipe(
            switchMap(plans => [loadPlansSuccess({plans})]),
            catchError((e) => of(loadProjectFailure({ err: e }))),
        ))
    ))

    public reloadPlans$ = createEffect(() => this.actions$.pipe(
        ofType(registerPlanComputationSuccess,cancelPlanComputationSuccess,planComputationFinishedSuccess),
        concatLatestFrom(() => [this.store.select(selectProject)]),
        filterListNotNullOrUndefined(),
        switchMap(([_, project]) => this.service.getPlans$(project._id).pipe(
            switchMap(plans => [loadPlansSuccess({plans})]),
            catchError((e) => of(loadProjectFailure({ err: e }))),
        ))
    ))

}