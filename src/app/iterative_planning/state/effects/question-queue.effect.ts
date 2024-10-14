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
import { poseAnswer, questionPosed, registerGlobalExplanationComputation } from "../iterative-planning.actions";
import { selectExplanation, selectIterationStep, selectIterativePlanningProperties } from "../iterative-planning.selector";

@Injectable()
export class QuestionQueueEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);

  computeExplanation$ = createEffect(() => this.actions$.pipe(
    ofType(questionPosed),
    concatLatestFrom(({ question: { iterationStepId }}) => this.store.select(selectIterationStep(iterationStepId))),
    mergeMap(([{ question: {iterationStepId } }, iterationStep]) => {
      const hash = explanationHash(iterationStep);

      return this.store.select(selectExplanation(hash)).pipe(
        tap(console.log),
        take(1),
        map(({explanation}) => !explanation),
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
    role: 'system',
  }
}
