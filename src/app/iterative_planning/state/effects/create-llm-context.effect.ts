import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import { createLLMContext,createLLMContextFailure,createLLMContextSuccess} from "../iterative-planning.actions";
import { LLMService } from "src/app/LLM/service/llm.service";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterationStep } from "../iterative-planning.actions";
import { selectIterativePlanningProject } from "../iterative-planning.selector";
@Injectable()
export class CreateLLMContextEffect{

    private actions$ = inject(Actions)
    private llmService = inject(LLMService)

    private store = inject(Store);
    

        public createLLMContext$ = createEffect(() => this.actions$.pipe(
        ofType(selectIterationStep),
        concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
        switchMap(([{iterationStepId}, project]) => this.llmService.createLLMContext$(project._id, iterationStepId).pipe(
            tap(LLMContext => console.log("LLMContext: ", LLMContext)),
            switchMap(LLMContext => [
                createLLMContextSuccess({LLMContext})
            ]),
            catchError(() => of(createLLMContextFailure())),
        ))
    ))

    // loadPlanProperties$ = createEffect(() => this.actions$.pipe(
    //     ofType(loadProjectSuccess),
    //     concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
    //     map(([_, { _id: id }]) => loadPlanProperties({ id })),
    // ));
}