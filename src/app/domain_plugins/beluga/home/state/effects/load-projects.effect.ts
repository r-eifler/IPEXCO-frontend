import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectService } from "../../services/project.service";
import { loadProjects, loadProjectsFailure, loadProjectsSuccess } from "../home.actions";

@Injectable()
export class LoadProjectsEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectService)

    public loadProjectMetaDataList$ = createEffect(() => this.actions$.pipe(
        ofType(loadProjects),
        switchMap(() => this.service.getProjectList$().pipe(
            map(projects => loadProjectsSuccess({projects})),
            catchError((e) => of(loadProjectsFailure({err: e})))
        ))
    ))
}