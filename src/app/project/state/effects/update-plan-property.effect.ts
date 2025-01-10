import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadDemoPlanProperties, updatePlanProperty, updatePlanPropertyFailure, updatePlanPropertySuccess} from "../project.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectPlanPropertyService } from "../../service/plan-properties.service";

@Injectable()
export class ProjectDemoUpdatePlanPropertyEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectPlanPropertyService)

    public updatePlanProperty$ = createEffect(() => this.actions$.pipe(
        ofType(updatePlanProperty),
        switchMap(({planProperty}) => this.service.putPlanProperty$(planProperty).pipe(
            switchMap(planProperty => [updatePlanPropertySuccess({planProperty}),loadDemoPlanProperties({id: planProperty.project})]),
            catchError(() => of(updatePlanPropertyFailure()))
        ))
    ))
}