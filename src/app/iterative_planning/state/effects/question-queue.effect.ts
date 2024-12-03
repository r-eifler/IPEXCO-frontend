import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { filter, map, mergeMap, switchMap, take, tap } from "rxjs";
import { getAnswer, getComputedBase, mapComputeBase } from "../../domain/explanation/answer-factory";
import { explanationHash } from "../../domain/explanation/explanation-hash";
import { ExplanationRunStatus, GlobalExplanation } from "../../domain/explanation/explanations";
import { ExplanationMessage } from "../../domain/interface/explanation-message";
import { Question } from "../../domain/interface/question";
import { IterationStep } from "../../domain/iteration_step";
import { poseAnswer, questionPosed, questionPosedLLM, registerGlobalExplanationComputation, sendMessageToLLMExplanationTranslator, sendMessageToLLMExplanationTranslatorFailure, sendMessageToLLMExplanationTranslatorSuccess } from "../iterative-planning.actions";
import { selectExplanation, selectIterationStep, selectIterativePlanningProject, selectIterativePlanningProjectExplanationInterfaceType, selectIterativePlanningProperties, selectLLMThreadIdET } from "../iterative-planning.selector";
import { selectIterationStepbyId } from "../../../iterative_planning/state/iterative-planning.selector";
import { ExplanationInterfaceType } from "src/app/project/domain/general-settings";
import { LLMService } from "src/app/LLM/service/llm.service";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class QuestionQueueEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private LLMService = inject(LLMService);

  explanationInterfaceType$ = this.store.select(selectIterativePlanningProjectExplanationInterfaceType);
  


  computeExplanation$ = createEffect(() => this.actions$.pipe(
    ofType(questionPosed, questionPosedLLM),
    concatLatestFrom(({ question: { iterationStepId }}) => this.store.select(selectIterationStep(iterationStepId))),
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
    concatLatestFrom(({ question: { iterationStepId }}) => this.store.select(selectIterationStep(iterationStepId))),
    mergeMap(([{ question }, iterationStep]) => {
      const hash = explanationHash(iterationStep);

      return this.store.select(selectExplanation(hash)).pipe(
        filter(explanation => explanation?.status === ExplanationRunStatus.failed || explanation?.status === ExplanationRunStatus.finished),
        take(1),
        concatLatestFrom(() => [this.store.select(selectIterativePlanningProperties)]),
        map(([explanation, properties]) => composeAnswer(iterationStep, question, explanation, properties[question.propertyId]?.name)),
        map(answer => poseAnswer({ answer })),
      )
    })
  ))

  postAnswerLLM$ = createEffect(() => this.actions$.pipe(
    ofType(questionPosedLLM),
    concatLatestFrom(({ question: { iterationStepId }}) => this.store.select(selectIterationStep(iterationStepId))),
    mergeMap(([{ question, naturalLanguageQuestion }, iterationStep]) => {
      const hash = explanationHash(iterationStep);
      console.log("Submitted question: " + naturalLanguageQuestion);
      console.log("Provided as: " + question);

      return this.store.select(selectExplanation(hash)).pipe(
        filter(explanation => explanation?.status === ExplanationRunStatus.failed || explanation?.status === ExplanationRunStatus.finished),
        take(1),
        concatLatestFrom(() => [this.store.select(selectIterativePlanningProperties)]),
        map(([explanation, properties]) => 
          ({question, explanation: mapComputeBase(iterationStep, question, getComputedBase(question.questionType, explanation)), question_type: question.questionType, questionArguments: [properties[question.propertyId]], iterationStepId: iterationStep._id})
        ),
        concatLatestFrom(({question, explanation, question_type, questionArguments,iterationStepId}) => [
          this.store.select(selectLLMThreadIdET),
          this.store.select(selectIterativePlanningProject),
          this.store.select(selectIterativePlanningProperties),
          this.store.select(selectIterationStepbyId(iterationStepId))]),
        switchMap(([{question, explanation, question_type, questionArguments, iterationStepId}, threadIdET, project, properties, iterationStep]) => {
            return this.LLMService.postMessageET$(naturalLanguageQuestion, explanation,question_type, questionArguments, iterationStep, project, Object.values(properties), threadIdET).pipe(
                switchMap(response => [sendMessageToLLMExplanationTranslatorSuccess({ response: response.response, threadId: response.threadId })]),
                catchError(() => of(sendMessageToLLMExplanationTranslatorFailure()))
            );
        })
      )
    })
  ))


  
  
}

function composeAnswer(iterationStep: IterationStep, question: Question, explanation: GlobalExplanation, propertyDescription?: string): ExplanationMessage {
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
