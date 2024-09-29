import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { CreateProjectService } from "../../service/create-project.service";
import { createProject, createProjectFailure, loadProjectMetaDataList } from "../project-meta.actions";

@Injectable()
export class CreateProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(CreateProjectService)

    public createProject$ = createEffect(() => this.actions$.pipe(
        ofType(createProject),
        switchMap(({project}) => this.service.postProject$(project).pipe(
            map(project => loadProjectMetaDataList()),
            catchError(() => of(createProjectFailure()))
        ))
    ))
}