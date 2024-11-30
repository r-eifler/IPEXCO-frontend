import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectPlanPropertyService } from "../../service/plan-properties.service";
import { loadPlanProperties, loadPlanPropertiesFailure, loadPlanPropertiesSuccess } from "../project.actions";

@Injectable()
export class LoadProjectPlanPropertiesEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectPlanPropertyService)

    public loadProject$ = createEffect(() => this.actions$.pipe(
        ofType(loadPlanProperties),
        switchMap(({id}) => this.service.getPlanProperties$(id).pipe(
            map(planProperties => loadPlanPropertiesSuccess({planProperties})),
            catchError(() => of(loadPlanPropertiesFailure())),
        ))
    ))

}