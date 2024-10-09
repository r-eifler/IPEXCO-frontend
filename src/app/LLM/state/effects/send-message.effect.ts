import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { LLMService } from "../../service/llm.service";
import { sendMessageToLLM, sendMessageToLLMFailure, sendMessageToLLMQuestionTranslator, sendMessageToLLMQuestionTranslatorFailure, sendMessageToLLMQuestionTranslatorSuccess, sendMessageToLLMSuccess } from "../llm.actions";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { selectMessages } from "../llm.selector";

@Injectable()
export class SendMessageToLLMEffect{

    private actions$ = inject(Actions)
    private service = inject(LLMService)
    private store = inject(Store);

    public sendMessage$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLM),
        concatLatestFrom(() => this.store.select(selectMessages)),
        switchMap(([{request}, messages]) => this.service.postMessage$(messages).pipe(
            map(response => sendMessageToLLMSuccess({response})),
            catchError(() => of(sendMessageToLLMFailure()))
        ))
    ))

    public sendMessageToQuestionTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMQuestionTranslator),
        switchMap((action) => this.service.postMessage$(action,endpoint="qt").pipe(
            map(response => sendMessageToLLMQuestionTranslatorSuccess({ response })),
            catchError(() => of(sendMessageToLLMQuestionTranslatorFailure()))
        ))
    ))          
}