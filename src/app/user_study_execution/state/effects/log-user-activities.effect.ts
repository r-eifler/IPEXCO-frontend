import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { executionUserStudyStart, executionUserStudySubmit, logAction, logActionFailure, logActionSuccess, logPlanComputationFinished} from '../user-study-execution.actions';
import { Store } from '@ngrx/store';
import { selectExecutionUserStudyPendingIterationSteps, selectExecutionUserStudyStep, selectExecutionUserStudyStepIndex } from '../user-study-execution.selector';
import { concatLatestFrom } from '@ngrx/operators';
import { ActionType, CancelPlanForIterationStepUserAction } from '../../domain/user-action';
import { cancelPlanComputationAndIterationStep, createIterationStepSuccess, loadIterationStepsSuccess, poseAnswer, questionPosed, selectIterationStep } from 'src/app/iterative_planning/state/iterative-planning.actions';
import { StepStatus } from 'src/app/iterative_planning/domain/iteration_step';
import { computeUtility } from 'src/app/iterative_planning/domain/plan';
import { selectIterationStepById, selectIterativePlanningProject, selectIterativePlanningProperties, selectIterativePlanningSelectedStepId } from 'src/app/iterative_planning/state/iterative-planning.selector';
import { structuredTextToString } from 'src/app/iterative_planning/domain/interface/explanation-message';
import { selectIsUserStudy, selectUserRole } from 'src/app/user/state/user.selector';
import { UserStudyExecutionService } from '../../service/user-study-execution.service';


@Injectable()
export class LogUserActivitiesEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private service = inject(UserStudyExecutionService);

    public loadUserStudy$ = createEffect(() => this.actions$.pipe(
        ofType(logAction),
        concatLatestFrom(() => this.store.select(selectUserRole)),
        filter(([_, role]) => role == 'user-study'),
        mergeMap(([{action},_]) => this.service.log$(action).pipe(
            map(() => logActionSuccess()),
            catchError(() => of(logActionFailure()))
        ))
    ));

    
    public studyStarted$ = createEffect(() => this.actions$.pipe(
        ofType(executionUserStudyStart),
        mergeMap(() => [logAction({action: {type: ActionType.START_STUDY}})]
        )
    ));

    // Does not work because user is already logged out
    // public studyEnded$ = createEffect(() => this.actions$.pipe(
    //     ofType(executionUserStudySubmit),
    //     switchMap(() => [logAction({action: {type: ActionType.END_STUDY}})]
    //     )
    // ));


    public nextStep$ = createEffect(() => this.store.select(selectExecutionUserStudyStepIndex).pipe(
        concatLatestFrom(() => this.store.select(selectExecutionUserStudyStep)),
        filter(([index, step]) => index !== null && !!step),
        mergeMap(([index, step]) => {
            console.log("Logging the current step")
            if(step?.type == 'demo'){
                return [logAction({action: {
                    type: ActionType.START_DEMO, 
                    data: {
                        stepIndex: index,
                        stepName: step.name,
                        demoId: step.content
                    }
                }})]
            }
            else if(step?.type == 'description'){
                return [logAction({action: {
                    type: ActionType.START_DESCRIPTION, 
                    data: {
                        stepIndex: index,
                        stepName: step.name
                    }
                }})]
            }
            else if(step?.type == 'form'){
                return [logAction({action: {
                    type: ActionType.START_EXTERNAL, 
                    data: {
                        stepIndex: index,
                        stepName: step.name
                    }
                }})]
            }
            else if(step?.type == 'demoInfo'){
                return [logAction({action: {
                    type: ActionType.START_DEMO_INFO, 
                    data: {
                        stepIndex: index,
                        stepName: step.name
                    }
                }})]
            }
            else if(step?.type == 'userManual'){
                return [logAction({action: {
                    type: ActionType.START_USER_MANUAL, 
                    data: {
                        stepIndex: index,
                        stepName: step.name
                    }
                }})]
            }
            else {
                return [logAction({action: {
                    type: ActionType.OTHER, 
                    data: {
                        stepIndex: index,
                        stepName: step.name
                    }
                }})]
            }
        })
    ));


    // Iteration Steps

    public iterStepCreated$ = createEffect(() => this.actions$.pipe(
        ofType(createIterationStepSuccess),
        switchMap(({iterationStep}) => [logAction({action: {
                type: ActionType.CREATE_ITERATION_STEP, 
                data: {
                    stepId: iterationStep._id,
                    demoId: iterationStep.project
                }
            }})]
        )
    ));

    public planForIterStep$ = createEffect(() => this.actions$.pipe(
        ofType(loadIterationStepsSuccess),
        concatLatestFrom(() => [
            this.store.select(selectExecutionUserStudyPendingIterationSteps),
            this.store.select(selectIterativePlanningProperties)
        ]),
        switchMap(([{iterationSteps}, pendingStepIdes, planProperties]) => 
            iterationSteps.filter(step => pendingStepIdes.includes(step._id) && step.status != StepStatus.unknown).
            flatMap(step => [
                logPlanComputationFinished({iterationStepId: step._id}),
                logAction({action: {
                    type: ActionType.PLAN_FOR_ITERATION_STEP, 
                    data: {
                        demoId: step.project,
                        stepId: step._id,
                        utility: computeUtility(step.plan, planProperties)
                    }
                }})
            ]))
        )
    );


    public cancelPlanForIterStep$ = createEffect(() => this.actions$.pipe(
        ofType(cancelPlanComputationAndIterationStep),
        concatLatestFrom(({iterationStepId}) => [this.store.select(selectIterationStepById(iterationStepId))]),
        switchMap(([{iterationStepId}, step]) => [
            logAction({action: {
                type: ActionType.CANCEL_PLAN_FOR_ITERATION_STEP, 
                data: {
                    stepId: iterationStepId,
                    demoId: step.project
                }
            }})
        ])
    ));

    public inspectIterStep$ = createEffect(() => this.actions$.pipe(
        ofType(selectIterationStep),
        concatLatestFrom(({iterationStepId}) => [this.store.select(selectIterationStepById(iterationStepId))]),
        switchMap(([{iterationStepId}, step]) => [
            logAction({action: {
                type: ActionType.INSPECT_ITERATION_STEP, 
                data: {
                    stepId: iterationStepId,
                    demoId: step ? step.project : undefined
                }
            }})
        ])
    ));



    // Questions and Explanations

    public questionAsked$ = createEffect(() => this.actions$.pipe(
        ofType(questionPosed),
        concatLatestFrom(() => [
            this.store.select(selectIterativePlanningSelectedStepId),
            this.store.select(selectIterativePlanningProject)
        ]),
        switchMap(([{question}, iterationStepId, project]) => [
            logAction({action: {
                type: ActionType.ASK_QUESTION, 
                data: {
                    demoId: project._id,
                    stepId: iterationStepId,
                    propertyId: question.propertyId,
                    questionType: question.questionType,
                }
            }})
        ])
    ));


    public answerPosed$ = createEffect(() => this.actions$.pipe(
        ofType(poseAnswer),
        concatLatestFrom(() => [
            this.store.select(selectIterativePlanningProperties),
            this.store.select(selectIterativePlanningProject)
        ]),
        switchMap(([{answer}, planProperties, project]) => [
            logAction({action: {
                type: ActionType.EXPLANATION, 
                data: {
                    demoId: project._id,
                    iterationStepId: answer.iterationStepId,
                    message: structuredTextToString(answer.message, answer.conflictSets, planProperties),
                    propertyId: answer.propertyId,
                    questionType: answer.questionType,
                    subSets: answer.conflictSets
                }
            }})
        ])
    ));

}
