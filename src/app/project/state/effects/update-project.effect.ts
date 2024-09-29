import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { updateProject, updateProjectFailure, updateProjectSuccess } from "../project.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { ProjectService } from "../../service/project.service";
import { of } from "rxjs";

@Injectable()
export class UpdateProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectService)

    public updateProject$ = createEffect(() => this.actions$.pipe(
        ofType(updateProject),
        switchMap(({project}) => this.service.putProject$(project).pipe(
            map(project => updateProjectSuccess({project})),
            catchError(() => of(updateProjectFailure()))
        ))
    ))
}