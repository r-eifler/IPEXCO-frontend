import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap, tap, filter } from "rxjs/operators";
import { LLMService } from "src/app/LLM/service/llm.service";
import { concatLatestFrom } from "@ngrx/operators";
import { loadProject, loadProjectSuccess, selectIterationStep } from "../iterative-planning.actions";
import { selectIterativePlanningProject } from "../iterative-planning.selector";
import { createLLMContext, createLLMContextFailure, createLLMContextSuccess } from "../iterative-planning.actions";
import { Store } from "@ngrx/store";
import { PropertyCreationInterfaceType, ExplanationInterfaceType, LLMContextSetup } from "src/app/project/domain/general-settings";

@Injectable()
export class CreateLLMContextEffect{

    private actions$ = inject(Actions)
    private llmService = inject(LLMService)
    private store = inject(Store);

    public createLLMContext$ = createEffect(() => this.actions$.pipe(
    ofType(selectIterationStep),
    concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
    filter(([_, project]) => !!project),
    filter(([_, project]) => 
        project!.settings.interfaces.propertyCreationInterfaceType === PropertyCreationInterfaceType.LLM_CHAT || 
        project!.settings.interfaces.explanationInterfaceType === ExplanationInterfaceType.LLM_CHAT
        ),
    filter(([_, project]) => project!.settings.llmConfig.llmContextSetup === LLMContextSetup.ITERATION_STEP), // Only create LLM context for iteration step
    switchMap(([{iterationStepId}, project]) => this.llmService.createLLMContext$(project!._id, iterationStepId).pipe(
        tap(LLMContext => console.log("LLMContext: ", LLMContext)),
        switchMap(LLMContext => [
            createLLMContextSuccess({LLMContext})
        ]),
        catchError((e) => of(createLLMContextFailure({err: e}))),
    ))
    ))

    public createLLMContextProject$ = createEffect(() => this.actions$.pipe(
        ofType(loadProjectSuccess),
        filter(action => action.project!.settings.llmConfig.llmContextSetup === LLMContextSetup.PROJECT), // Only create LLM context for iteration step
        switchMap(({project}) => this.llmService.createLLMContext$(project!._id).pipe(
            tap(LLMContext => console.log("LLMContext: ", LLMContext)),
            switchMap(LLMContext => [
                createLLMContextSuccess({LLMContext})
            ]),
            catchError((e) => of(createLLMContextFailure({err: e}))),
        ))
        ))

}