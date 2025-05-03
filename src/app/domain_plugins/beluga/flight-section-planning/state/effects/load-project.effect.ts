import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { ProjectService } from "../../services/project.service";
import { loadDomainSpecification, loadFlightPlanTree, loadProject, loadProjectFailure, loadProjectSuccess, loadServices } from "../flight-section-planning.actions";


@Injectable()
export class LoadProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectService)

    public loadProject$ = createEffect(() => this.actions$.pipe(
        ofType(loadProject),
        switchMap(({id}) => this.service.getProject$(id).pipe(
            switchMap(project => [
                loadProjectSuccess({project}), 
                loadServices(),
                loadDomainSpecification({id: project.domain})
            ]),
            catchError((e) => of(loadProjectFailure({err: e})))
        ))
    ))
}
