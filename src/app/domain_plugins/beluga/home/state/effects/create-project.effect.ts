import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { CreateProjectService } from "../../services/create-project.service";
import { createDefaultPlanProperties, createProject, createProjectFailure, createProjectSuccess, loadProjects } from "../home.actions";

@Injectable()
export class CreateProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(CreateProjectService)

    public createProject$ = createEffect(() => this.actions$.pipe(
        ofType(createProject),
        switchMap(({project}) => this.service.postProject$(project).pipe(
            switchMap(project => [createProjectSuccess({project}), loadProjects(), createDefaultPlanProperties({project: project})]),
            catchError((e) => of(createProjectFailure({err: e})))
        ))
    ))
}