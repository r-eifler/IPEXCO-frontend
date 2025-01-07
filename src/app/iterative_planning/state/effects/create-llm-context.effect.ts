import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import { createLLMContext,createLLMContextFailure,createLLMContextSuccess} from "../iterative-planning.actions";
import { LLMService } from "src/app/LLM/service/llm.service";

@Injectable()
export class CreateLLMContextEffect{

    private actions$ = inject(Actions)
    private llmService = inject(LLMService)

    private store = inject(Store);
    

    public createLLMContext$ = createEffect(() => this.actions$.pipe(
        ofType(createLLMContext),
        switchMap(({ projectId, domain }) => this.llmService.createLLMContext$(projectId, domain).pipe(
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