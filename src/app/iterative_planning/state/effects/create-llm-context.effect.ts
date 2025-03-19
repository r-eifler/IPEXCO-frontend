import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { LLMService } from "src/app/LLM/service/llm.service";
import { createLLMContext, createLLMContextFailure, createLLMContextSuccess } from "../iterative-planning.actions";

@Injectable()
export class CreateLLMContextEffect{

    private actions$ = inject(Actions)
    private llmService = inject(LLMService)

    public createLLMContext$ = createEffect(() => this.actions$.pipe(
        ofType(createLLMContext),
        switchMap(({ projectId, domain }) => this.llmService.createLLMContext$(projectId, domain).pipe(
            tap(LLMContext => console.log("LLMContext: ", LLMContext)),
            switchMap(LLMContext => [
                
                createLLMContextSuccess({LLMContext})
            ]),
            catchError((e) => of(createLLMContextFailure({err: e}))),
        ))
    ))

}