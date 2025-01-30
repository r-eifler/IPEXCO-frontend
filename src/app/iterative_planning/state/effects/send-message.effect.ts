import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, filter, first, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { LLMService } from "../../../LLM/service/llm.service";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { selectLLMChatMessages, selectLLMThreadIdQT, selectLLMThreadIdGT, selectLLMThreadIdET } from "../iterative-planning.selector";
import { questionTranslationRequestToString, explanationTranslationRequestToString } from "../../../LLM/interfaces/translators_interfaces_strings";
import { GoalTranslationRequest, QuestionTranslationRequest, ExplanationTranslationRequest } from "../../../LLM/interfaces/translators_interfaces";
import { selectIterativePlanningProject, selectIterativePlanningProjectExplanationInterfaceType, selectIterativePlanningProperties, selectIterativePlanningSelectedStep, selectIterationStepById } from "../../../iterative_planning/state/iterative-planning.selector";
import { selectUnsatisfiedSoftGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { selectSatisfiedSoftGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { selectEnforcedGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { ExplanationInterfaceType } from "src/app/project/domain/general-settings";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { directMessageET, directResponseQT, loadLLMContext, loadLLMContextFailure, loadLLMContextSuccess, poseAnswer, poseAnswerLLM, questionPosed, questionPosedLLM, sendMessageToLLMExplanationTranslator, sendMessageToLLMExplanationTranslatorFailure, sendMessageToLLMExplanationTranslatorSuccess, sendMessageToLLMGoalTranslator, sendMessageToLLMGoalTranslatorFailure, sendMessageToLLMGoalTranslatorSuccess, sendMessageToLLMQTthenGTTranslators, sendMessageToLLMQTthenGTTranslatorsFailure, sendMessageToLLMQTthenGTTranslatorsSuccess, sendMessageToLLMQuestionTranslator, sendMessageToLLMQuestionTranslatorFailure, sendMessageToLLMQuestionTranslatorSuccess, showReverseTranslationGT, showReverseTranslationQT } from "src/app/iterative_planning/state/iterative-planning.actions";
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



    // public sendMessageToGoalTranslator$ = createEffect(() => this.actions$.pipe(
    //     ofType(sendMessageToLLMGoalTranslator),
    //     concatLatestFrom(() => [
    //         this.store.select(selectIterativePlanningProject),
    //         this.store.select(selectIterativePlanningProperties),
    //         this.store.select(selectLLMThreadIdGT)
    //     ]),
    //     switchMap(([action, project, properties, threadIdGT]) => {
    //         const startTime = performance.now();
    //         return this.service.postMessageGT$(action.goalDescription, project, Object.values(properties), threadIdGT).pipe(
    //             map(({ response: { formula, shortName, reverseTranslation, feedback }, threadId }) => {
    //                 const duration = performance.now() - startTime;
    //                 return sendMessageToLLMGoalTranslatorSuccess({ response: { formula, shortName }, threadId, duration });
    //             }),
    //             catchError(() => of(sendMessageToLLMGoalTranslatorFailure()))
    //         );
    //     })
    // ))

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
            const startTime = performance.now();
            return this.service.postMessageQTthenGT$(question, iterationStep, project, Object.values(properties), threadIdQT, threadIdGT).pipe(
            ).pipe(
                switchMap(response => {
                    const duration = performance.now() - startTime;
                    if ('directResponse' in response) {
                        if (response.questionType === QuestionType.DIRECT_USER) {
                            return [
                                sendMessageToLLMQTthenGTTranslatorsSuccess({ threadIdQt: response.threadIdQt, threadIdGt: response.threadIdGt, duration }),
                                directResponseQT({ directResponse: response.directResponse })
                            ];
                        } else if (response.questionType === QuestionType.DIRECT_ET) {
                            return [
                                sendMessageToLLMQTthenGTTranslatorsSuccess({ threadIdQt: response.threadIdQt, threadIdGt: response.threadIdGt, duration }),
                                directMessageET({ directResponse: response.directResponse, iterationStepId })
                            ];
                        }
                    }
                    else {
                        return [
                            sendMessageToLLMQTthenGTTranslatorsSuccess({ threadIdQt: response.threadIdQt, threadIdGt: response.threadIdGt, duration }),
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
        filter(({ question, iterationStepId }) => !!question && !!iterationStepId),
        concatLatestFrom(({ question, iterationStepId }) => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterativePlanningProperties),
            this.store.select(selectIterationStepById(iterationStepId)),
            this.store.select(selectLLMThreadIdQT)
        ]),
        filter(([_, project, properties, iterationStep]) => 
            !!project && !!properties && !!iterationStep
        ),
        switchMap(([{ question, iterationStepId }, project, properties, iterationStep, threadIdQT]) => {
            const startTime = performance.now();
            return this.service.postMessageQT$(question, iterationStep, project, Object.values(properties), threadIdQT).pipe(
                map(response => {
                    const duration = performance.now() - startTime;
                    console.log(`QT service call took ${duration}ms`);
                    return {response, duration};
                })
            ).pipe(
                switchMap(({response, duration}) => {
                    if (!response) {
                        throw new Error('Empty response from LLM service');
                    }

                    if ('directResponse' in response) {
                        switch(response.questionType) {
                            case QuestionType.DIRECT_USER:
                                return [
                                    sendMessageToLLMQuestionTranslatorSuccess({ threadId: response.threadId, response: response.directResponse, duration }),
                                    directResponseQT({ directResponse: response.directResponse }),
                                ];
                            case QuestionType.DIRECT_ET:
                                return [
                                    sendMessageToLLMQuestionTranslatorSuccess({ threadId: response.threadId, response: response.directResponse, duration }),
                                    directMessageET({ directResponse: response.directResponse, iterationStepId })
                                ];
                            default:
                                console.warn('Unexpected question type:', response.questionType);
                                return of(sendMessageToLLMQuestionTranslatorFailure());
                        }
                    }
                    else {
                        console.log('reverse translation QT');
                        return [
                            sendMessageToLLMQuestionTranslatorSuccess({ threadId: response.threadId, duration }),
                            ...('reverseTranslationQT' in response && typeof response.reverseTranslationQT === 'string' ? [showReverseTranslationQT({ reverseTranslation: response.reverseTranslationQT })] : []),
                            ...('question' in response ? [questionPosedLLM({ question: response.question as Question, naturalLanguageQuestion: question })] : [])
                        ];
                    }
                }),
                catchError((error) => {
                    console.error('Error in question translator:', error);
                    return of(sendMessageToLLMQuestionTranslatorFailure());
                })
            );
        })
    ))

    // public sendMessageToExplanationTranslator$ = createEffect(() => this.actions$.pipe(
    //     ofType(sendMessageToLLMExplanationTranslator),
    //     concatLatestFrom(({ question, explanationMUGS, explanationMGCS, question_type, questionArgument, iterationStepId }) => [
    //         this.store.select(selectLLMThreadIdET),
    //         this.store.select(selectIterativePlanningProject),
    //         this.store.select(selectIterativePlanningProperties),
    //         this.store.select(selectIterationStepById(iterationStepId))]),
    //     switchMap(([{ question, explanationMUGS, explanationMGCS, question_type, questionArgument, iterationStepId }, threadIdET, project, properties, iterationStep]) => {
    //         const startTime = performance.now();
    //         return this.service.postMessageET$(question, explanationMUGS, explanationMGCS, question_type as QuestionType, questionArgument, iterationStep, project, Object.values(properties), threadIdET).pipe(
    //             switchMap(response => {
    //                 const duration = performance.now() - startTime;
    //                 return [sendMessageToLLMExplanationTranslatorSuccess({ response: response.response, threadId: response.threadId, duration })];
    //             }),
    //             catchError(() => of(sendMessageToLLMExplanationTranslatorFailure()))
    //         );
    //     })
    // ))

    public sendDirectMessageToExplanationTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(directMessageET),
        concatLatestFrom(({ directResponse, iterationStepId }) => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterationStepById(iterationStepId)),
            this.store.select(selectLLMThreadIdET)
        ]),
        switchMap(([{ directResponse, iterationStepId }, project, iterationStep, threadIdET]) => {
            const startTime = performance.now();
            return this.service.postDirectMessageET$(directResponse, project, iterationStep, threadIdET).pipe(
                map(response => {
                    const duration = performance.now() - startTime;
                    return sendMessageToLLMExplanationTranslatorSuccess({ 
                        response: response.response, 
                        threadId: response.threadId,
                        duration
                    });
                }),
                catchError(() => of(sendMessageToLLMExplanationTranslatorFailure()))
            )
        })
    ))

    public loadLLMContext$ = createEffect(() => this.actions$.pipe(
        ofType(loadLLMContext),
        switchMap(({ projectId }) => this.service.getLLMContext$(projectId).pipe(
            map(LLMContext => loadLLMContextSuccess({ LLMContext })),
            catchError(() => of(loadLLMContextFailure())),
        ))
    ))
}
