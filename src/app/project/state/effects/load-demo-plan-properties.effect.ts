import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectPlanPropertyService } from "../../service/plan-properties.service";
import { loadAllDemosPlanProperties, loadDemoPlanProperties, loadDemoPlanPropertiesFailure, loadDemoPlanPropertiesSuccess, loadPlanProperties, loadPlanPropertiesFailure, loadPlanPropertiesSuccess } from "../project.actions";
import { selectProjectDemoIds } from "../project.selector";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";

@Injectable()
export class LoadDemoProjectPlanPropertiesEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private service = inject(ProjectPlanPropertyService);


    public loadAllDemoProperties$ = createEffect(() => this.actions$.pipe(
        ofType(loadAllDemosPlanProperties),
        concatLatestFrom(() => this.store.select(selectProjectDemoIds)),
        switchMap(([_, demoIds]) => demoIds.map(id => loadDemoPlanProperties({id})))
    ))

    public loadDemoProperties$ = createEffect(() => this.actions$.pipe(
        ofType(loadDemoPlanProperties),
        mergeMap(({id}) => this.service.getPlanPropertiesList$(id).pipe(
            map(planProperties => loadDemoPlanPropertiesSuccess({demoId: id, planProperties})),
            catchError(() => of(loadDemoPlanPropertiesFailure())),
        ))
    ))

}