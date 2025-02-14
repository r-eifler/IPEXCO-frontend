import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { filter, map, mergeMap, switchMap, take, tap } from "rxjs";
import { getAnswer, getComputedBase, mapComputeBase } from "../../domain/explanation/answer-factory";
import { explanationHash } from "../../domain/explanation/explanation-hash";
import { DefinedGlobalExplanation, ExplanationRunStatus, GlobalExplanation, QuestionType } from "../../domain/explanation/explanations";
import { ExplanationMessage } from "../../domain/interface/explanation-message";
import { Question } from "../../domain/interface/question";
import { IterationStep, StepStatus } from "../../domain/iteration_step";
import { poseAnswer, questionPosed, questionPosedLLM, registerGlobalExplanationComputation, sendMessageToLLMExplanationTranslator, sendMessageToLLMExplanationTranslatorFailure, sendMessageToLLMExplanationTranslatorSuccess } from "../iterative-planning.actions";
import { selectExplanation, selectIterationStepById, selectIterativePlanningProject, selectIterativePlanningProjectExplanationInterfaceType, selectIterativePlanningProperties, selectLLMThreadIdET } from "../iterative-planning.selector";
import { ExplanationInterfaceType } from "src/app/project/domain/general-settings";
import { LLMService } from "src/app/LLM/service/llm.service";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";
import { filterListNotNullOrUndefined, filterNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";

@Injectable()
export class QuestionQueueEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private LLMService = inject(LLMService);

  explanationInterfaceType$ = this.store.select(selectIterativePlanningProjectExplanationInterfaceType);
  


  computeExplanation$ = createEffect(() => this.actions$.pipe(
    ofType(questionPosed, questionPosedLLM),
    concatLatestFrom(({ question: { iterationStepId }}) => this.store.select(selectIterationStepById(iterationStepId))),
    filterListNotNullOrUndefined(),
    mergeMap(([{ question: {iterationStepId } }, iterationStep]) => {
      const hash = explanationHash(iterationStep);

      return this.store.select(selectExplanation(hash)).pipe(
        take(1),
        map((explanation) => !explanation),
        tap( needsComputation => console.log('registerGlobalExplanationComputation: ' + needsComputation)),
        switchMap(needsComputation => needsComputation ? [registerGlobalExplanationComputation({ iterationStepId })] : []),
      );
    }),
  ));

  postAnswer$ = createEffect(() => this.actions$.pipe(
    ofType(questionPosed),
    concatLatestFrom(({ question: { iterationStepId }}) => this.store.select(selectIterationStepById(iterationStepId))),
    filterListNotNullOrUndefined(),
    mergeMap(([{ question }, iterationStep]) => {
      const hash = explanationHash(iterationStep);

      return this.store.select(selectExplanation(hash)).pipe(
        filter(explanation => 
          explanation?.status === ExplanationRunStatus.finished &&
          explanation?.MGCS !== undefined &&
          explanation?.MUGS !== undefined
        ),
        map(exp => exp as DefinedGlobalExplanation),
        take(1),
        concatLatestFrom(() => [this.store.select(selectIterativePlanningProperties)]),
        filterListNotNullOrUndefined(),
        map(([explanation, properties]) => composeAnswer(iterationStep, question, explanation, question.propertyId ? properties[question.propertyId]?.name : undefined)),
        map(answer => poseAnswer({ answer })),
      )
    })
  ))

  postAnswerLLM$ = createEffect(() => this.actions$.pipe(
    ofType(questionPosedLLM),
    concatLatestFrom(({ question: { iterationStepId }}) => this.store.select(selectIterationStepById(iterationStepId))),
    filterListNotNullOrUndefined(),
    mergeMap(([{ question, naturalLanguageQuestion }, iterationStep]) => {
      const hash = explanationHash(iterationStep);
      console.log("Submitted question: " + naturalLanguageQuestion);
      console.log("Provided as: " + question);

      return this.store.select(selectExplanation(hash)).pipe(
        // tap(explanation => console.log('Explanation from store:', explanation)),
        filterNotNullOrUndefined(),
        filter(explanation =>  
          (explanation.status === ExplanationRunStatus.failed || 
           explanation.status === ExplanationRunStatus.finished)),
        tap(explanation => console.log('After filter - explanation status:', explanation?.status)),
        take(1),
        concatLatestFrom(() => [this.store.select(selectIterativePlanningProperties)]),
        map(([explanation, properties]) => ({
          question,
          explanationMUGS: (explanation.MUGS !== undefined && iterationStep.status === StepStatus.solvable) ? 
            mapComputeBase(iterationStep, {...question, questionType: QuestionType.WHY_NOT_PROPERTY}, explanation.MUGS) : 
            (explanation.MUGS !== undefined &&  iterationStep.status === StepStatus.unsolvable ? mapComputeBase(iterationStep, {...question, questionType: QuestionType.WHY_PLAN}, explanation.MUGS) : []),
          explanationMGCS: (explanation.MGCS !== undefined && iterationStep.status === StepStatus.solvable) ? 
            mapComputeBase(iterationStep, {...question, questionType: QuestionType.HOW_PROPERTY}, explanation.MGCS) : 
            (explanation.MGCS !== undefined && iterationStep.status === StepStatus.unsolvable ? mapComputeBase(iterationStep, {...question, questionType: QuestionType.HOW_PLAN}, explanation.MGCS) : []),
          question_type: question.questionType,
          questionArgument: question.propertyId && properties?.[question.propertyId] ? [properties[question.propertyId]] : [],
          iterationStepId: iterationStep._id
        })),
        concatLatestFrom(({question, explanationMUGS, explanationMGCS, question_type, questionArgument, iterationStepId}) => [
          this.store.select(selectLLMThreadIdET),
          this.store.select(selectIterativePlanningProject),
          this.store.select(selectIterativePlanningProperties),
          this.store.select(selectIterationStepById(iterationStepId))
        ]),
        switchMap(([data, threadIdET, project, properties, iterationStep]) => {
          if(iterationStep === undefined || iterationStep == null ||properties == null || project == null){
            return of(sendMessageToLLMExplanationTranslatorFailure())
          }
          return this.LLMService.postMessageET$(
            naturalLanguageQuestion, 
            data.explanationMUGS, 
            data.explanationMGCS, 
            data.question_type, 
            data.questionArgument, 
            iterationStep, 
            project, 
            Object.values(properties), 
            threadIdET
          ).pipe(
            switchMap(response => [sendMessageToLLMExplanationTranslatorSuccess({ 
              response: response?.response || 'No response received', 
              threadId: response?.threadId 
            })]),
            catchError((error) => {
              console.error('Error in postMessageET$:', error);
              return of(sendMessageToLLMExplanationTranslatorFailure());
            })
          );
        })
      )
    }),
    catchError((error) => {
      console.error('Global error in postAnswerLLM$:', error);
      return of(sendMessageToLLMExplanationTranslatorFailure());
    })
  ));


  
  
}

function composeAnswer(iterationStep: IterationStep, question: Question, explanation: DefinedGlobalExplanation, propertyDescription?: string): ExplanationMessage {
  const questionType = question.questionType;
  const propertyId = question.propertyId;
  const conflictSets = mapComputeBase(iterationStep, question, getComputedBase(questionType, explanation));
  const message = getAnswer(questionType, conflictSets, propertyDescription);

  return {
    questionType,
    propertyId,
    iterationStepId: iterationStep._id,
    message,
    conflictSets,
    role: 'sender',
  }
}
