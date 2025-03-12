import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { PlanningProjectService } from "../../service/project.service";
import { loadDomainSpecification, loadPlans, loadProject, loadProjectFailure, loadProjectSuccess } from "../planning.actions";

@Injectable()
export class LoadPlanningProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(PlanningProjectService)

    public loadProject$ = createEffect(() => this.actions$.pipe(
        ofType(loadProject),
        switchMap(({id}) => this.service.getProject$(id).pipe(
            switchMap(project => [
                loadProjectSuccess({project}), 
                loadDomainSpecification({id: project.domain}),
                loadPlans({ id })
            ]),
            catchError((e) => of(loadProjectFailure({ err: e }))),
        ))
    ))

}