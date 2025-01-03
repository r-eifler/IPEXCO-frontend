import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { DemoPlanPropertyService } from "../../services/plan-properties.service";
import { loadAllDemosPlanProperties, loadDemoPlanProperties, loadDemoPlanPropertiesFailure, loadDemoPlanPropertiesSuccess } from "../demo.actions";
import { selectAllDemosIds } from "../demo.selector";

@Injectable()
export class LoadDemoPlanPropertiesEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private service = inject(DemoPlanPropertyService);


    public loadAllDemoProperties$ = createEffect(() => this.actions$.pipe(
        ofType(loadAllDemosPlanProperties),
        concatLatestFrom(() => this.store.select(selectAllDemosIds)),
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