import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadPlanProperties, loadProject, loadProjectDemos, loadProjectFailure, loadProjectSuccess } from "../project.actions";
import { catchError, switchMap } from "rxjs/operators";
import { ProjectService } from "../../service/project.service";
import { of } from "rxjs";

@Injectable()
export class LoadProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectService)

    public loadProject$ = createEffect(() => this.actions$.pipe(
        ofType(loadProject),
        switchMap(({id}) => this.service.getProject$(id).pipe(
            switchMap(project => [loadProjectSuccess({project})]),
            catchError(() => of(loadProjectFailure()))
        ))
    ));

    public loadProjectSuccess = createEffect(() => this.actions$.pipe(
        ofType(loadProjectSuccess),
        switchMap(({project}) => [loadPlanProperties({id: project._id}), loadProjectDemos({id:project._id})])
    ));
}