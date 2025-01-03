import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadDemoPlanProperties, loadProjectDemo, loadProjectDemoFailure, loadProjectDemoSuccess} from "../project.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectDemoService } from "../../service/demo.service";

@Injectable()
export class LoadProjectDemoEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectDemoService)

    public loadDemo$ = createEffect(() => this.actions$.pipe(
        ofType(loadProjectDemo),
        switchMap(({id}) => this.service.getDemo$(id).pipe(
            switchMap(demo => [loadProjectDemoSuccess({demo}), loadDemoPlanProperties({id})]),
            catchError(() => of(loadProjectDemoFailure()))
        ))
    ))
}