import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { PolicyTestingProjectService } from "../../services/project.service";
import { loadFlightPlanTree, loadProject, loadProjectFailure, loadProjectSuccess, loadTestCollections } from "../policy-testing.actions";
@Injectable()
export class LoadProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(PolicyTestingProjectService)

    public loadProject$ = createEffect(() => this.actions$.pipe(
        ofType(loadProject),
        switchMap(({id}) => this.service.getProject$(id).pipe(
            switchMap(project => [
                loadProjectSuccess({project}),
                loadTestCollections({projectId: project._id}),
                loadFlightPlanTree({projectId: project._id})
            ]),
            catchError((e) => of(loadProjectFailure({err: e})))
        ))
    ))
}