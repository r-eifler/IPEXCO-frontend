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
import { selectIterativePlanningProject, selectIterativePlanningProjectExplanationInterfaceType, selectIterativePlanningProperties, selectIterativePlanningSelectedStep, selectIterationStepById } from "../../../iterative_planning/state/iterative-planning.selector";
import { selectUnsatisfiedSoftGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { selectSatisfiedSoftGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { selectEnforcedGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { ExplanationInterfaceType } from "src/app/project/domain/general-settings";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { directMessageET, directResponseQT, loadLLMContext, loadLLMContextFailure, loadLLMContextSuccess, poseAnswer, poseAnswerLLM, questionPosed, questionPosedLLM, sendMessageToLLMExplanationTranslator, sendMessageToLLMExplanationTranslatorFailure, sendMessageToLLMExplanationTranslatorSuccess, sendMessageToLLMGoalTranslator, sendMessageToLLMGoalTranslatorFailure, sendMessageToLLMGoalTranslatorSuccess, sendMessageToLLMQTthenGTTranslators, sendMessageToLLMQTthenGTTranslatorsFailure, sendMessageToLLMQTthenGTTranslatorsSuccess, sendMessageToLLMQuestionTranslator, sendMessageToLLMQuestionTranslatorSuccess, showReverseTranslationGT, showReverseTranslationQT } from "src/app/iterative_planning/state/iterative-planning.actions";
import { Question } from "src/app/iterative_planning/domain/interface/question";
import { getComputedBase } from "../../domain/explanation/answer-factory";
import { mapComputeBase } from "../../domain/explanation/answer-factory";
import { QuestionType } from "src/app/iterative_planning/domain/explanation/explanations";
@Injectable()
export class SendMessageToLLMEffect {

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
                map(({ response: { formula, shortName, reverseTranslation, feedback }, threadId }) => sendMessageToLLMGoalTranslatorSuccess({ response: { formula, shortName }, threadId })),
                catchError(() => of(sendMessageToLLMGoalTranslatorFailure()))
            );
        })
    ))

    public sendMessageToQuestionAndGoalTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMQTthenGTTranslators),
        concatLatestFrom(({ question, iterationStepId }) => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterativePlanningProperties),
            this.store.select(selectIterationStepById(iterationStepId)),
            this.store.select(selectLLMThreadIdGT),
            this.store.select(selectLLMThreadIdQT)
        ]),
        switchMap(([{ question, iterationStepId }, project, properties, iterationStep, threadIdGT, threadIdQT]) => {
            return this.service.postMessageQTthenGT$(question, iterationStep, project, Object.values(properties), threadIdQT, threadIdGT).pipe(
            ).pipe(
                switchMap(response => {
                    if ('directResponse' in response) {
                        if (response.questionType === QuestionType.DIRECT_USER) {
                            return [
                                sendMessageToLLMQTthenGTTranslatorsSuccess({ threadIdQt: response.threadIdQt, threadIdGt: response.threadIdGt }),
                                directResponseQT({ directResponse: response.directResponse })
                            ];
                        } else if (response.questionType === QuestionType.DIRECT_ET) {
                            return [
                                sendMessageToLLMQTthenGTTranslatorsSuccess({ threadIdQt: response.threadIdQt, threadIdGt: response.threadIdGt }),
                                directMessageET({ directResponse: response.directResponse, iterationStepId })
                            ];
                        }
                    }
                    else {
                        return [
                            sendMessageToLLMQTthenGTTranslatorsSuccess({ threadIdQt: response.threadIdQt, threadIdGt: response.threadIdGt }),
                            ...('reverseTranslationQT' in response ? [showReverseTranslationQT({ reverseTranslation: response.reverseTranslationQT })] : []),
                            ...('question' in response ? [questionPosedLLM({ question: response.question, naturalLanguageQuestion: question })] : [])
                        ];
                    }
                }),
                catchError(() => of(sendMessageToLLMQTthenGTTranslatorsFailure()))
            );
        })
    ))


    public sendMessageToQuestionTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMQuestionTranslator),
        concatLatestFrom(({ question, iterationStepId }) => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterativePlanningProperties),
            this.store.select(selectIterationStepById(iterationStepId)),
            this.store.select(selectLLMThreadIdQT)
        ]),
        switchMap(([{ question, iterationStepId }, project, properties, iterationStep, threadIdQT]) => {
            return this.service.postMessageQT$(question, iterationStep, project, Object.values(properties), threadIdQT).pipe(
            ).pipe(
                switchMap(response => {
                    if ('directResponse' in response) {
                        if (response.questionType === QuestionType.DIRECT_USER) {
                            console.log('direct response QT');
                            return [
                                sendMessageToLLMQuestionTranslatorSuccess({ threadId: response.threadId }),
                                directResponseQT({ directResponse: response.directResponse })
                            ];
                        } else if (response.questionType === QuestionType.DIRECT_ET) {
                            console.log('direct response ET');
                            return [
                                sendMessageToLLMQuestionTranslatorSuccess({ threadId: response.threadId }),
                                directMessageET({ directResponse: response.directResponse, iterationStepId })
                            ];
                        }
                    }
                    else {
                        console.log('reverse translation QT');
                        return [
                            sendMessageToLLMQuestionTranslatorSuccess({ threadId: response.threadId }),
                            ...('reverseTranslationQT' in response && typeof response.reverseTranslationQT === 'string' ? [showReverseTranslationQT({ reverseTranslation: response.reverseTranslationQT })] : []),
                            ...('question' in response ? [questionPosedLLM({ question: response.question as Question, naturalLanguageQuestion: question })] : [])
                        ];
                    }
                    console.log(response);
                }),
                catchError(() => of(sendMessageToLLMQTthenGTTranslatorsFailure()))
            );
        })
    ))

    public sendMessageToExplanationTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMExplanationTranslator),
        concatLatestFrom(({ question, explanation, question_type, questionArgument, iterationStepId }) => [
            this.store.select(selectLLMThreadIdET),
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterativePlanningProperties),
            this.store.select(selectIterationStepById(iterationStepId))]),
        switchMap(([{ question, explanation, question_type, questionArgument, iterationStepId }, threadIdET, project, properties, iterationStep]) => {
            return this.service.postMessageET$(question, explanation, question_type as QuestionType, questionArgument, iterationStep, project, Object.values(properties), threadIdET).pipe(
                switchMap(response => [sendMessageToLLMExplanationTranslatorSuccess({ response: response.response, threadId: response.threadId })]),
                catchError(() => of(sendMessageToLLMExplanationTranslatorFailure()))
            );
        })
    ))

    public sendDirectMessageToExplanationTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(directMessageET),
        concatLatestFrom(({ directResponse, iterationStepId }) => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterationStepById(iterationStepId)),
            this.store.select(selectLLMThreadIdET)
        ]),
        switchMap(([{ directResponse, iterationStepId }, project, iterationStep, threadIdET]) => 
            this.service.postDirectMessageET$(directResponse, project, iterationStep, threadIdET).pipe(
                map(response => sendMessageToLLMExplanationTranslatorSuccess({ 
                    response: response.response, 
                    threadId: response.threadId 
                })),
                catchError(() => of(sendMessageToLLMExplanationTranslatorFailure()))
            )
        )
    ))

    public loadLLMContext$ = createEffect(() => this.actions$.pipe(
        ofType(loadLLMContext),
        switchMap(({ projectId }) => this.service.getLLMContext$(projectId).pipe(
            map(LLMContext => loadLLMContextSuccess({ LLMContext })),
            catchError(() => of(loadLLMContextFailure())),
        ))
    ))
}
