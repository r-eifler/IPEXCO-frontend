import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadProjectList, loadProjectListFailure, loadProjectListSuccess } from "../project.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { ProjectService } from "../../service/project.service";
import { of } from "rxjs";

@Injectable()
export class LoadProjectListEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectService)

    public loadProjectList$ = createEffect(() => this.actions$.pipe(
        ofType(loadProjectList),
        switchMap(() => this.service.getProjectList$().pipe(
            map(projects => loadProjectListSuccess({projects})),
            catchError(() => of(loadProjectListFailure()))
        ))
    ))
}