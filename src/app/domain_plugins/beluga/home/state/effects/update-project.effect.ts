import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectService } from "../../services/project.service";
import { updateProject, updateProjectFailure, updateProjectSuccess } from "../home.actions";

@Injectable()
export class UpdateProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectService)

    public updateProject$ = createEffect(() => this.actions$.pipe(
        ofType(updateProject),
        switchMap(({project}) => this.service.putProject$(project).pipe(
            map(project => updateProjectSuccess({project})),
            catchError((e) => of(updateProjectFailure({err: e})))
        ))
    ))
}