import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { IterativePlanningProjectService } from "../../service/project.service";
import { createLLMContext, loadIterationSteps, loadLLMContext, loadPlanProperties, loadProject, loadProjectFailure, loadProjectSuccess } from "../iterative-planning.actions";
import { Store } from "@ngrx/store";

@Injectable()
export class LoadIterativePlanningProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(IterativePlanningProjectService)

    private store = inject(Store);

    public loadProject$ = createEffect(() => this.actions$.pipe(
        ofType(loadProject),
        switchMap(({id}) => this.service.getProject$(id).pipe(
            switchMap(project => [
                loadProjectSuccess({project}), 
                loadPlanProperties({id}), 
                loadIterationSteps({ id }),
                ...(project.settings.interfaces.explanationInterfaceType === 'LLM_CHAT' || 
                    project.settings.interfaces.propertyCreationInterfaceType === 'LLM_CHAT' 
                    ? [createLLMContext({projectId: id, domain: project.baseTask?.domain_name})]
                    : [])
            ]),
            catchError(() => of(loadProjectFailure())),
        ))
    ))

    // loadPlanProperties$ = createEffect(() => this.actions$.pipe(
    //     ofType(loadProjectSuccess),
    //     concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
    //     map(([_, { _id: id }]) => loadPlanProperties({ id })),
    // ));
}