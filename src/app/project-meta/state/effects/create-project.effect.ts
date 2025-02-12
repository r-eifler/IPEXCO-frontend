import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { CreateProjectService } from "../../service/create-project.service";
import { createProject, createProjectFailure, createProjectSuccess, loadProjectMetaDataList } from "../project-meta.actions";

@Injectable()
export class CreateProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(CreateProjectService)

    public createProject$ = createEffect(() => this.actions$.pipe(
        ofType(createProject),
        switchMap(({project}) => this.service.postProject$(project).pipe(
            switchMap(_ => [createProjectSuccess(), loadProjectMetaDataList()]),
            catchError(() => of(createProjectFailure()))
        ))
    ))
}