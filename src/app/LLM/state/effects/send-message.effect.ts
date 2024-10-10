import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { LLMService } from "../../service/llm.service";
import { sendMessageToLLM, sendMessageToLLMFailure, sendMessageToLLMQuestionTranslator, sendMessageToLLMQuestionTranslatorFailure, sendMessageToLLMQuestionTranslatorSuccess, sendMessageToLLMSuccess, sendMessageToLLMGoalTranslator, sendMessageToLLMGoalTranslatorSuccess, sendMessageToLLMGoalTranslatorFailure, sendMessageToLLMExplanationTranslator, sendMessageToLLMExplanationTranslatorSuccess, sendMessageToLLMExplanationTranslatorFailure } from "../llm.actions";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { selectMessages, selectThreadIdQT, selectThreadIdGT, selectThreadIdET } from "../llm.selector";
import { goalTranslationRequestToString, questionTranslationRequestToString, explanationTranslationRequestToString } from "../../interfaces/translators_interfaces_strings";
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
  
    public sendMessageToGoalTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMGoalTranslator),
        switchMap(({request,threadId}) => this.service.postMessageGT$(request).pipe(
            map(response => sendMessageToLLMGoalTranslatorSuccess({response: response, threadId: threadId})),
            catchError(() => of(sendMessageToLLMGoalTranslatorFailure()))
        ))
    ))

    public sendMessageToQuestionTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMQuestionTranslator),
        switchMap(({request,threadId}) => this.service.postMessageQT$(request).pipe(
            map(response => sendMessageToLLMQuestionTranslatorSuccess({response: response, threadId: threadId})),
            catchError(() => of(sendMessageToLLMQuestionTranslatorFailure()))
        ))
    ))

    public sendMessageToExplanationTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMExplanationTranslator),
        switchMap(({request, threadId}) => this.service.postMessageET$(request).pipe(
            map(response => sendMessageToLLMExplanationTranslatorSuccess({response: response, threadId: threadId})),
            catchError(() => of(sendMessageToLLMExplanationTranslatorFailure()))
        ))
    ))
}