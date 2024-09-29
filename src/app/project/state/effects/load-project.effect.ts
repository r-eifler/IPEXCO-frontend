import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadProject, loadProjectFailure, loadProjectSuccess } from "../project.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { ProjectService } from "../../service/project.service";
import { of } from "rxjs";

@Injectable()
export class LoadProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectService)

    public loadProject$ = createEffect(() => this.actions$.pipe(
        ofType(loadProject),
        switchMap(({id}) => this.service.getProject$(id).pipe(
            map(project => loadProjectSuccess({project})),
            catchError(() => of(loadProjectFailure()))
        ))
    ))
}