import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { ProjectDemoService } from "../../service/demo.service";
import { loadProjectDemos, updateDemo, updateDemoFailure, updateDemoSuccess } from "../project.actions";

@Injectable()
export class UpdateDemoEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectDemoService)

    public updateDemo$ = createEffect(() => this.actions$.pipe(
        ofType(updateDemo),
        switchMap(({id, demo}) => this.service.putDemo$(id, demo).pipe(
            switchMap((demo)  => [
                updateDemoSuccess({demo}), 
                demo.projectId !== null ? loadProjectDemos({id: demo.projectId}) : null,
            ].filter(e => e !== null)),
            catchError((e) => of(updateDemoFailure({err: e})))
        ))
    ))

}