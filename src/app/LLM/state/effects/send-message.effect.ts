import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { LLMService } from "../../service/llm.service";
import { sendMessageToLLM, sendMessageToLLMFailure, sendMessageToLLMQuestionTranslator, sendMessageToLLMQuestionTranslatorFailure, sendMessageToLLMQuestionTranslatorSuccess, sendMessageToLLMSuccess, sendMessageToLLMGoalTranslator, sendMessageToLLMGoalTranslatorSuccess, sendMessageToLLMGoalTranslatorFailure, sendMessageToLLMExplanationTranslator, sendMessageToLLMExplanationTranslatorSuccess, sendMessageToLLMExplanationTranslatorFailure, sendMessageToLLMAllTranslatorsSuccess, sendMessageToLLMAllTranslatorsFailure, sendMessageToLLMAllTranslators } from "../llm.actions";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { selectMessages, selectThreadIdQT, selectThreadIdGT, selectThreadIdET } from "../llm.selector";
import { goalTranslationRequestToString, questionTranslationRequestToString, explanationTranslationRequestToString } from "../../interfaces/translators_interfaces_strings";
import { GoalTranslationRequest, QuestionTranslationRequest, ExplanationTranslationRequest } from "../../interfaces/translators_interfaces";
import { selectIterativePlanningProject, selectIterativePlanningProperties } from "src/app/iterative_planning/state/iterative-planning.selector";
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
        concatLatestFrom(() => [this.store.select(selectIterativePlanningProject),this.store.select(selectIterativePlanningProperties)]),
        switchMap(([{request, threadId}, project, properties]) => {
            const goalTranslationRequest: GoalTranslationRequest = {
                goalDescription: request,
                predicates: project.baseTask.model.predicates,
                objects: project.baseTask.model.objects,
                existingPlanProperties: Object.values(properties)
            };
            const requestString = goalTranslationRequestToString(goalTranslationRequest);
            return this.service.postMessageGT$(requestString, threadId).pipe(
                map(response => sendMessageToLLMGoalTranslatorSuccess({response: response.response, threadId: response.threadId})),
                catchError(() => of(sendMessageToLLMGoalTranslatorFailure()))
            );
        })
    ))

    public sendMessageToQuestionTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMQuestionTranslator),
        concatLatestFrom(() => [this.store.select(selectIterativePlanningProject),this.store.select(selectIterativePlanningProperties)]),
        switchMap(([{request, threadId}, project, properties]) => {
            const questionTranslationRequest: QuestionTranslationRequest = {
                question: request,
                enforcedGoals: [], // TODO: Get from store
                satisfiedGoals: [], // TODO: Get from store
                unsatisfiedGoals: [], // TODO: Get from store
                existingPlanProperties: Object.values(properties)
            };
            const requestString = questionTranslationRequestToString(questionTranslationRequest);
            return this.service.postMessageQT$(requestString, threadId).pipe(
                map(response => sendMessageToLLMQuestionTranslatorSuccess({response: response.response, threadId: response.threadId})),
                catchError(() => of(sendMessageToLLMQuestionTranslatorFailure()))
            );
        })
    ))

    public sendMessageToExplanationTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMExplanationTranslator),
        concatLatestFrom(() => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterativePlanningProperties)
        ]),
        switchMap(([{request, threadId}, project, properties]) => {
            const explanationTranslationRequest: ExplanationTranslationRequest = {
                question: request,
                question_type: "", // TODO: Get from store
                questionArguments: [], // TODO: Get from store
                MUGS: [], // TODO: Get from store
                MGCS: [], // TODO: Get from store
                predicates: project.baseTask.model.predicates,
                objects: project.baseTask.model.objects,
                enforcedGoals: [], // TODO: Get from store
                satisfiedGoals: [], // TODO: Get from store
                unsatisfiedGoals: [], // TODO: Get from store
                existingPlanProperties: Object.values(properties),
                history: [] // TODO: Get from store
            };
            const requestString = explanationTranslationRequestToString(explanationTranslationRequest);
            return this.service.postMessageET$(requestString, threadId).pipe(
                map(response => sendMessageToLLMExplanationTranslatorSuccess({response: response.response, threadId: response.threadId})),
                catchError(() => of(sendMessageToLLMExplanationTranslatorFailure()))
            );
        })
    ))

    public sendMessageToAllTranslators$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMAllTranslators),
        switchMap(({qtRequest, gtRequest, etRequest, threadIdQt, threadIdGt, threadIdEt}) => this.service.postMessageAllTranslators$(qtRequest, gtRequest, etRequest, threadIdQt, threadIdGt, threadIdEt).pipe(
            map(response => sendMessageToLLMAllTranslatorsSuccess(response)),
            catchError(() => of(sendMessageToLLMAllTranslatorsFailure()))
        ))
    ))
}