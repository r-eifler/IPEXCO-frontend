import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { IterativePlanningProjectService } from "../../service/project.service";
import { createLLMContext, loadDomainSpecification, loadIterationSteps, loadLLMContext, loadPlanProperties, loadProject, loadProjectFailure, loadProjectSuccess } from "../iterative-planning.actions";
import { Store } from "@ngrx/store";

@Injectable()
export class LoadIterativePlanningProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(IterativePlanningProjectService)

    private store = inject(Store);

    public loadProject$ = createEffect(() => this.actions$.pipe(
        ofType(loadProject),
        switchMap(({id}) => this.service.getProject$(id).pipe(
            switchMap(project => [loadProjectSuccess({project})]),
            catchError((e) => of(loadProjectFailure({err: e}))),
        ))
    ))

    public onLoadProject$ = createEffect(() => this.actions$.pipe(
        ofType(loadProjectSuccess),
        switchMap(({project}) => [
            loadDomainSpecification({id: project.domain}),
            loadPlanProperties({id: project._id}), 
            loadIterationSteps({id: project._id}),
            ...(project.settings.interfaces.explanationInterfaceType === 'LLM_CHAT' || 
                project.settings.interfaces.propertyCreationInterfaceType === 'LLM_CHAT' 
                ? [createLLMContext({projectId: project._id, iterationStepId: null})]
                : [])
        ]),
            catchError((e) => of(loadProjectFailure({err: e}))),
    ));
}