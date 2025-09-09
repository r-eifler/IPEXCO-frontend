import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, filter, first, map, switchMap, tap } from "rxjs/operators";
import { of, from, concat } from "rxjs";
import { LLMService } from "../../../LLM/service/llm.service";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { selectIterativePlanningProject, selectIterativePlanningProjectExplanationInterfaceType, selectIterativePlanningProperties, selectIterativePlanningSelectedStep, selectIterationStepById } from "../../../iterative_planning/state/iterative-planning.selector";
import { selectUnsatisfiedSoftGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { selectSatisfiedSoftGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { selectEnforcedGoals } from "src/app/iterative_planning/view/step-detail-view/step-detail-view.component.selector";
import { ExplanationInterfaceType } from "src/app/project/domain/general-settings";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";

import {
    directMessageET, directResponseQT, questionPosedLLM,
    sendMessageToLLMExplanationTranslatorFailure,
    sendMessageToLLMExplanationTranslatorSuccess,
    sendMessageToLLMGoalTranslator,
    sendMessageToLLMGoalTranslatorFailure,
    sendMessageToLLMGoalTranslatorSuccess,
    sendMessageToLLMQuestionTranslator,
    sendMessageToLLMQuestionTranslatorFailure,
    sendMessageToLLMQuestionTranslatorSuccess,
    showReverseTranslationQT
} from "src/app/iterative_planning/state/iterative-planning.actions";

import { Question } from "src/app/iterative_planning/domain/interface/question";

import { QuestionType } from "src/app/iterative_planning/domain/explanation/explanations";
import { filterListNotNullOrUndefined, filterNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";
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
        map((step) => step.plan?.status == PlanRunStatus.UNSOLVABLE)
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

    project$ = this.store.select(selectIterativePlanningProject)
    goalTranslatorEnabled$ = this.project$.pipe(
        map(project => project?.settings?.llmConfig?.goalTranslator ?? false)
    )
    showReverseTranslation$ = this.project$.pipe(
        map(project => project?.settings?.llmConfig?.showReverseTranslation ?? false)
    )



    public sendMessageToGoalTranslator$ = createEffect(() => this.actions$.pipe(
        ofType(sendMessageToLLMGoalTranslator),
        concatLatestFrom(() => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterativePlanningProperties),
        ]),
        switchMap(([action, project, properties]) => {
            const startTime = performance.now();
            return this.service.postMessageGT$(action.goalDescription, project!, Object.values(properties || {})).pipe(
                map(({ response: { formula, shortName, reverseTranslation, feedback } }) => {
                    const duration = performance.now() - startTime;
                    return sendMessageToLLMGoalTranslatorSuccess({ response: { formula, shortName }, duration });
                }),
                catchError((error) => of(sendMessageToLLMGoalTranslatorFailure({ err: error })))
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
            this.goalTranslatorEnabled$
        ]),
        filter(([_, project, properties, iterationStep]) => 
            !!project && !!properties && !!iterationStep
        ),
        switchMap(([{ question, iterationStepId }, project, properties, iterationStep]) => {
            if(project === undefined || iterationStep === undefined || iterationStep == null || properties === undefined){
                return of(sendMessageToLLMExplanationTranslatorFailure({err: "[LLM} translation failed"}));
            }
            const startTime = performance.now();
            return this.goalTranslatorEnabled$.pipe(
                switchMap(goalTranslatorEnabled => {
                    if (goalTranslatorEnabled) {
                        return this.service.postMessageQTthenGT$(question, iterationStep, project, Object.values(properties)).pipe(
                            map(response => {
                                const duration = performance.now() - startTime;
                                console.log(`QT service call took ${duration}ms`);
                                return {response, duration};
                            })
                        );
                    } else {
                        console.log("Currently not using the goal translator")
                        return this.service.postMessageQT$(question, iterationStep, project, Object.values(properties)).pipe(
                            map(response => {
                                const duration = performance.now() - startTime;
                                console.log(`QT service call took ${duration}ms`);
                                return {response, duration};
                            })
                        );
                    }
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
                                    sendMessageToLLMQuestionTranslatorSuccess({ response: response.directResponse, duration }),
                                    directResponseQT({ directResponse: response.directResponse }),
                                ];
                            case QuestionType.DIRECT_ET:
                                return [
                                    sendMessageToLLMQuestionTranslatorSuccess({ response: response.directResponse, duration }),
                                    directMessageET({ directResponse: response.directResponse, iterationStepId })
                                ];
                            default:
                                console.warn('Unexpected question type:', response.questionType);
                                return of(sendMessageToLLMQuestionTranslatorFailure({err: "[LLM] Unexpected question type"}));
                        }
                    }
                    else {
                        console.log('reverse translation QT');
                        return this.showReverseTranslation$.pipe(
                            switchMap(showReverseTranslation => {
                                // Base action stream
                                const successAction = of(sendMessageToLLMQuestionTranslatorSuccess({ duration }));
                                
                                // Create an array of actions
                                const actions = [];
                                
                                // Success action is always included
                                actions.push(sendMessageToLLMQuestionTranslatorSuccess({ duration }));
                                
                                // Add reverse translation action if needed
                                if ('reverseTranslationQT' in response && 
                                    typeof response.reverseTranslationQT === 'string' && 
                                    showReverseTranslation) {
                                    actions.push(showReverseTranslationQT({ 
                                        reverseTranslation: response.reverseTranslationQT 
                                    }));
                                }
                                console.log('response', response);
                                // Add multiple questions action if needed
                                if ('qtResponse' in response && 'questions' in response && response.questions.length > 0) {
                                    console.log('multiple questions QT');
                                    actions.push(multipleQuestionsPosedLLM({ 
                                        questions: response.questions, 
                                        naturalLanguageQuestion: question 
                                    }));
                                }
                                // // Add question action if needed
                                // if ('question' in response && response.question.length == 0) {
                                //     console.log('single question QT');
                                //     actions.push(questionPosedLLM({ 
                                //         question: response.question as Question, 
                                //         naturalLanguageQuestion: question 
                                //     }));
                                // }
                                
                                // Use from to emit each action individually
                                return from(actions as any[]);
                            })
                        );
                    }
                }),
                catchError((error) => {
                    console.error('Error in question translator:', error);
                    return of(sendMessageToLLMQuestionTranslatorFailure({err: error}));
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
        ]),
        filter(([{ directResponse, iterationStepId }, project, iterationStep]) => project !== undefined),
        switchMap(([{ directResponse, iterationStepId }, project, iterationStep]) => {
            if(project === undefined || iterationStep == undefined ){
                return of(sendMessageToLLMExplanationTranslatorFailure({err: "LLM translation failed"}));
            }
            const startTime = performance.now();
            return this.service.postDirectMessageET$(directResponse, project, iterationStep).pipe(
                map(response => {
                    const duration = performance.now() - startTime;
                    return sendMessageToLLMExplanationTranslatorSuccess({ 
                        response: response.response, 
                        duration
                    });
                }),
                catchError((e) => of(sendMessageToLLMExplanationTranslatorFailure({err: e})))
            )
        })
    ))

    // public loadLLMContext$ = createEffect(() => this.actions$.pipe(
    //     ofType(loadLLMContext),
    //     switchMap(({ projectId }) => this.service.getLLMContext$(projectId).pipe(
    //         map(LLMContext => loadLLMContextSuccess({ LLMContext })),
    //         catchError((e) => of(loadLLMContextFailure({err: e}))),
    //     ))
    // ))
}
