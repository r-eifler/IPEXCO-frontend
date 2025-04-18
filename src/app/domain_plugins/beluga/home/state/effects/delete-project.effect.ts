import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { deleteProject, deleteProjectFailure, deleteProjectSuccess, loadProjects } from "../home.actions";
import { ProjectService } from "../../services/project.service";

@Injectable()
export class DeleteProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectService)

    public DeleteProjectEffect$ = createEffect(() => this.actions$.pipe(
        ofType(deleteProject),
        switchMap(({id}) => this.service.deleteProject$(id).pipe(
            switchMap(() => [deleteProjectSuccess(), loadProjects()]),
            catchError((e) => of(deleteProjectFailure({err: e})))
        ))
    ))
}