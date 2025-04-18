import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { deleteProject, deleteProjectFailure, deleteProjectSuccess, loadProjectMetaDataList } from "../home.actions";
import { ProjectMetaDataService } from "../../services/project-meta-data.service";

@Injectable()
export class DeleteProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectMetaDataService)

    public DeleteProjectEffect$ = createEffect(() => this.actions$.pipe(
        ofType(deleteProject),
        switchMap(({id}) => this.service.deleteProject$(id).pipe(
            switchMap(() => [deleteProjectSuccess(), loadProjectMetaDataList()]),
            catchError((e) => of(deleteProjectFailure({err: e})))
        ))
    ))
}