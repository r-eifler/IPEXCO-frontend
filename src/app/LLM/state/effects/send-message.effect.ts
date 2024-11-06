import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, filter, first, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { LLMService } from "../../service/llm.service";
import { sendMessageToLLM, sendMessageToLLMFailure, sendMessageToLLMQuestionTranslator, sendMessageToLLMQuestionTranslatorFailure, sendMessageToLLMQuestionTranslatorSuccess, sendMessageToLLMSuccess, sendMessageToLLMGoalTranslator, sendMessageToLLMGoalTranslatorSuccess, sendMessageToLLMGoalTranslatorFailure, sendMessageToLLMExplanationTranslator, sendMessageToLLMExplanationTranslatorSuccess, sendMessageToLLMExplanationTranslatorFailure, sendMessageToLLMAllTranslatorsSuccess, sendMessageToLLMAllTranslatorsFailure, sendMessageToLLMAllTranslators, sendMessageToLLMQTthenGTTranslators, sendMessageToLLMQTthenGTTranslatorsSuccess, sendMessageToLLMQTthenGTTranslatorsFailure } from "../llm.actions";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { selectMessages, selectThreadIdQT, selectThreadIdGT, selectThreadIdET } from "../llm.selector";
import { goalTranslationRequestToString, questionTranslationRequestToString, explanationTranslationRequestToString } from "../../interfaces/translators_interfaces_strings";
import { GoalTranslationRequest, QuestionTranslationRequest, ExplanationTranslationRequest } from "../../interfaces/translators_interfaces";
import { selectIterativePlanningProject, selectIterativePlanningProjectExplanationInterfaceType, selectIterativePlanningProperties, selectIterativePlanningSelectedStep } from "../../../iterative_planning/state/iterative-planning.selector";
import { selectUnsatisfiedSoftGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { selectSatisfiedSoftGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { selectEnforcedGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { ExplanationInterfaceType } from "src/app/project/domain/general-settings";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { questionPosed } from "src/app/iterative_planning/state/iterative-planning.actions";
import { Question } from "src/app/iterative_planning/domain/interface/question";
@Injectable()
export class SendMessageToLLMEffect{

    private actions$ = inject(Actions)
    private service = inject(LLMService)
    private store = inject(Store);

    explanationInterfaceType$ = this.store.select(selectIterativePlanningProjectExplanationInterfaceType);
    expInterfaceType = ExplanationInterfaceType;

    step$ = this.store.select(selectIterativePlanningSelectedStep);
    stepId$ = this.step$.pipe(map(step => step?._id));
    isUnsolvable$ = this.step$.pipe(
        filter((step) => !!step),
        map((step) => step.plan?.status == PlanRunStatus.not_solvable)
    );
    planProperties$ = this.store.select(selectIterativePlanningProperties);

    enforcedGoals$ = this.store.select(selectEnforcedGoals);
    solvedSoftGoals$ = this.store.select(selectSatisfiedSoftGoals);
    unsolvedSoftGoals$ = this.store.select(selectUnsatisfiedSoftGoals);

    hasEnforcedGoals$ = this.enforcedGoals$.pipe(map((goals) => !!goals?.length));
    hasSolvedSoftGoals$ = this.solvedSoftGoals$.pipe(
        map((goals) => !!goals?.length)
    );
    hasUnsolvedSoftGoals$ = this.unsolvedSoftGoals$.pipe(
        map((goals) => !!goals?.length)
    );


    // public sendMessage$ = createEffect(() => this.actions$.pipe(
    //     ofType(sendMessageToLLM),
    //     concatLatestFrom(() => this.store.select(selectMessages)),
    //     switchMap(([{request}, messages]) => this.service.postMessage$(messages).pipe(
    //         map(response => sendMessageToLLMSuccess({response})),
    //         catchError(() => of(sendMessageToLLMFailure()))
    //     ))
    // ))
  
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
        concatLatestFrom(() => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterativePlanningProperties),
            this.enforcedGoals$,
            this.solvedSoftGoals$,
            this.unsolvedSoftGoals$,
            this.isUnsolvable$  
        ]),
        switchMap(([{request, threadId}, project, properties, enforcedGoals, satisfiedGoals, unsatisfiedGoals, isUnsolvable]) => {
            const questionTranslationRequest: QuestionTranslationRequest = {
                question: request,
                enforcedGoals: enforcedGoals,
                satisfiedGoals: satisfiedGoals,
                unsatisfiedGoals: unsatisfiedGoals,
                existingPlanProperties: Object.values(properties),
                solvable: isUnsolvable ? "false" : "true"
            };
            const requestString = questionTranslationRequestToString(questionTranslationRequest);
            return this.service.postMessageQT$(requestString, threadId).pipe(
                map(response => sendMessageToLLMQuestionTranslatorSuccess({response: response.response, threadId: response.threadId})),
                catchError(() => of(sendMessageToLLMQuestionTranslatorFailure()))
            );
        })
    ))

    public sendMessageToQuestionAndGoalTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMQTthenGTTranslators),
        concatLatestFrom(() => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterativePlanningProperties),
            this.enforcedGoals$,
            this.solvedSoftGoals$,
            this.unsolvedSoftGoals$,
            this.isUnsolvable$
        ]),
        switchMap(([{request, threadIdQt, threadIdGt}, project, properties, enforcedGoals, satisfiedGoals, unsatisfiedGoals, isUnsolvable]) => {
            // Create and stringify Question Translator request
            const questionTranslationRequest: QuestionTranslationRequest = {
                question: request,
                enforcedGoals: enforcedGoals,
                satisfiedGoals: satisfiedGoals,
                unsatisfiedGoals: unsatisfiedGoals,
                existingPlanProperties: Object.values(properties),
                solvable: isUnsolvable ? "false" : "true"
            };
            const qtRequestString = questionTranslationRequestToString(questionTranslationRequest);

            // Create and stringify Goal Translator request
            const goalTranslationRequest: GoalTranslationRequest = {
                goalDescription: "{goal_description}",
                predicates: project.baseTask.model.predicates,
                objects: project.baseTask.model.objects,
                existingPlanProperties: Object.values(properties)
            };
            const gtRequestString = goalTranslationRequestToString(goalTranslationRequest);


            return this.service.postMessageQTthenGT$(
                qtRequestString,
                gtRequestString,
                threadIdQt,
                threadIdGt,
            ).pipe(
                switchMap(response => [sendMessageToLLMQTthenGTTranslatorsSuccess(response), questionPosed({question: response})]),
                catchError(() => of(sendMessageToLLMQTthenGTTranslatorsFailure()))
            );
        })
    ))        

    public sendMessageToExplanationTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMExplanationTranslator),
        concatLatestFrom(() => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterativePlanningProperties),
            this.enforcedGoals$,
            this.solvedSoftGoals$,
            this.unsolvedSoftGoals$
        ]),
        switchMap(([{request, threadId}, project, properties, enforcedGoals, satisfiedGoals, unsatisfiedGoals]) => {
            const explanationTranslationRequest: ExplanationTranslationRequest = {
                question: request,
                question_type: "", 
                questionArguments: [], 
                MUGS: [], 
                MGCS: [], 

                // All up to be passed in request

                predicates: project.baseTask.model.predicates,
                objects: project.baseTask.model.objects,
                enforcedGoals: enforcedGoals,
                satisfiedGoals: satisfiedGoals,
                unsatisfiedGoals: unsatisfiedGoals,
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
        concatLatestFrom(() => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterativePlanningProperties),
            this.enforcedGoals$,
            this.solvedSoftGoals$,
            this.unsolvedSoftGoals$,
            this.isUnsolvable$
        ]),
        switchMap(([{request, threadIdQt, threadIdGt, threadIdEt}, project, properties, enforcedGoals, satisfiedGoals, unsatisfiedGoals, isUnsolvable]) => {
            // Create and stringify Question Translator request
            const questionTranslationRequest: QuestionTranslationRequest = {
                question: request,
                enforcedGoals: enforcedGoals,
                satisfiedGoals: satisfiedGoals,
                unsatisfiedGoals: unsatisfiedGoals,
                existingPlanProperties: Object.values(properties),
                solvable: isUnsolvable ? "false" : "true"
            };
            const qtRequestString = questionTranslationRequestToString(questionTranslationRequest);

            // Create and stringify Goal Translator request
            const goalTranslationRequest: GoalTranslationRequest = {
                goalDescription: "{goal_description}",
                predicates: project.baseTask.model.predicates,
                objects: project.baseTask.model.objects,
                existingPlanProperties: Object.values(properties)
            };
            const gtRequestString = goalTranslationRequestToString(goalTranslationRequest);

            // Create and stringify Explanation Translator request
            const explanationTranslationRequest: ExplanationTranslationRequest = {
                question: request,
                question_type: "{question_type}", 
                questionArguments: [], 
                MUGS: [], 
                MGCS: [], 
                predicates: project.baseTask.model.predicates,
                objects: project.baseTask.model.objects,
                enforcedGoals: enforcedGoals,
                satisfiedGoals: satisfiedGoals,
                unsatisfiedGoals: unsatisfiedGoals,
                existingPlanProperties: Object.values(properties),
                history: [] // TODO: Get from store
            };
            const etRequestString = explanationTranslationRequestToString(explanationTranslationRequest);

            return this.service.postMessageAllTranslators$(
                qtRequestString, 
                gtRequestString, 
                etRequestString, 
                threadIdQt, 
                threadIdGt, 
                threadIdEt
            ).pipe(
                map(response => sendMessageToLLMAllTranslatorsSuccess(response)),
                catchError(() => of(sendMessageToLLMAllTranslatorsFailure()))
            );
        })
    ))
}