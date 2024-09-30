import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { CreateProjectService } from "../../service/create-project.service";
import { createProject, createProjectFailure, deleteProject, deleteProjectFailure, loadProjectMetaDataList } from "../project-meta.actions";
import { ProjectMetaDataService } from "../../service/project-meta-data.service";

@Injectable()
export class DeleteProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectMetaDataService)

    public DeleteProjectEffect$ = createEffect(() => this.actions$.pipe(
        ofType(deleteProject),
        switchMap(({id}) => this.service.deleteProject$(id).pipe(
            map(() => loadProjectMetaDataList()),
            catchError(() => of(deleteProjectFailure()))
        ))
    ))
}