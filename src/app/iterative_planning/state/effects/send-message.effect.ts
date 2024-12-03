import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, filter, first, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { LLMService } from "../../../LLM/service/llm.service";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { selectLLMChatMessages, selectLLMThreadIdQT, selectLLMThreadIdGT, selectLLMThreadIdET } from "../iterative-planning.selector";
import { goalTranslationRequestToString, questionTranslationRequestToString, explanationTranslationRequestToString } from "../../../LLM/interfaces/translators_interfaces_strings";
import { GoalTranslationRequest, QuestionTranslationRequest, ExplanationTranslationRequest } from "../../../LLM/interfaces/translators_interfaces";
import { selectIterativePlanningProject, selectIterativePlanningProjectExplanationInterfaceType, selectIterativePlanningProperties, selectIterativePlanningSelectedStep, selectIterationStepbyId } from "../../../iterative_planning/state/iterative-planning.selector";
import { selectUnsatisfiedSoftGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { selectSatisfiedSoftGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { selectEnforcedGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { ExplanationInterfaceType } from "src/app/project/domain/general-settings";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { loadLLMContext, loadLLMContextFailure, loadLLMContextSuccess, poseAnswer, poseAnswerLLM, questionPosed, questionPosedLLM, sendMessageToLLMExplanationTranslator, sendMessageToLLMExplanationTranslatorFailure, sendMessageToLLMExplanationTranslatorSuccess, sendMessageToLLMGoalTranslator, sendMessageToLLMGoalTranslatorFailure, sendMessageToLLMGoalTranslatorSuccess, sendMessageToLLMQTthenGTTranslators, sendMessageToLLMQTthenGTTranslatorsFailure, sendMessageToLLMQTthenGTTranslatorsSuccess } from "src/app/iterative_planning/state/iterative-planning.actions";
import { Question } from "src/app/iterative_planning/domain/interface/question";
import { getComputedBase } from "../../domain/explanation/answer-factory";
import { mapComputeBase } from "../../domain/explanation/answer-factory";
import { QuestionType } from "src/app/iterative_planning/domain/explanation/explanations";
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

    
  
    public sendMessageToGoalTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMGoalTranslator),
        concatLatestFrom(() => [
            this.store.select(selectIterativePlanningProject), 
            this.store.select(selectIterativePlanningProperties), 
            this.store.select(selectLLMThreadIdGT)
        ]),
        switchMap(([action, project, properties, threadIdGT]) => {
            return this.service.postMessageGT$(action.goalDescription, project, Object.values(properties), threadIdGT).pipe(
                map(({ response: { formula, shortName }, threadId }) => sendMessageToLLMGoalTranslatorSuccess({response: {formula, shortName}, threadId})),
                catchError(() => of(sendMessageToLLMGoalTranslatorFailure()))
            );
        })
    ))

    // public sendMessageToQuestionTranslator$ = createEffect(() => this.actions$.pipe(
    //     ofType(sendMessageToLLMQuestionTranslator),
    //     concatLatestFrom(() => [
    //         this.store.select(selectIterativePlanningProject),
    //         this.store.select(selectIterativePlanningProperties),
    //         this.enforcedGoals$,
    //         this.solvedSoftGoals$,
    //         this.unsolvedSoftGoals$,
    //         this.isUnsolvable$  
    //     ]),
    //     switchMap(([{request, threadId}, project, properties, enforcedGoals, satisfiedGoals, unsatisfiedGoals, isUnsolvable]) => {
    //         const questionTranslationRequest: QuestionTranslationRequest = {
    //             question: request,
    //             enforcedGoals: enforcedGoals,
    //             satisfiedGoals: satisfiedGoals,
    //             unsatisfiedGoals: unsatisfiedGoals,
    //             existingPlanProperties: Object.values(properties),
    //             solvable: isUnsolvable ? "false" : "true"
    //         };
    //         const requestString = questionTranslationRequestToString(questionTranslationRequest);
    //         return this.service.postMessageQT$(requestString, threadId).pipe(
    //             map(response => sendMessageToLLMQuestionTranslatorSuccess({response: response.response, threadId: response.threadId})),
    //             catchError(() => of(sendMessageToLLMQuestionTranslatorFailure()))
    //         );
    //     })
    // ))

    public sendMessageToQuestionAndGoalTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMQTthenGTTranslators),
        concatLatestFrom(({question, iterationStepId}) => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterativePlanningProperties),
            this.store.select(selectIterationStepbyId(iterationStepId)),
            this.store.select(selectLLMThreadIdGT),
            this.store.select(selectLLMThreadIdQT)
        ]),
        switchMap(([{question, iterationStepId}, project, properties, iterationStep, threadIdGT, threadIdQT]) => {            
            return this.service.postMessageQTthenGT$(question, iterationStep, project, Object.values(properties), threadIdQT, threadIdGT).pipe(
            ).pipe(
                switchMap(response => [sendMessageToLLMQTthenGTTranslatorsSuccess({threadIdQt: response.threadIdQt, threadIdGt: response.threadIdGt}), questionPosedLLM({question: response.question, naturalLanguageQuestion: question})]),
                catchError(() => of(sendMessageToLLMQTthenGTTranslatorsFailure()))
            );
        })
    ))        

    public sendMessageToExplanationTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMExplanationTranslator),
        concatLatestFrom(({question, explanation, question_type, questionArguments,iterationStepId}) => [
            this.store.select(selectLLMThreadIdET),
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterativePlanningProperties),
            this.store.select(selectIterationStepbyId(iterationStepId))]),
        switchMap(([{question, explanation, question_type, questionArguments, iterationStepId}, threadIdET, project, properties, iterationStep]) => {
            return this.service.postMessageET$(question, explanation, question_type as QuestionType, questionArguments, iterationStep, project, Object.values(properties), threadIdET).pipe(
                switchMap(response => [sendMessageToLLMExplanationTranslatorSuccess({ response: response.response, threadId: response.threadId })]),
                catchError(() => of(sendMessageToLLMExplanationTranslatorFailure()))
            );
        })
    ))

    public loadLLMContext$ = createEffect(() => this.actions$.pipe(
        ofType(loadLLMContext),
        switchMap(({projectId}) => this.service.getLLMContext$(projectId).pipe(
            map(LLMContext => loadLLMContextSuccess({LLMContext})),
            catchError(() => of(loadLLMContextFailure())),
        ))
    ))
}
