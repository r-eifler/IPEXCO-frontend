import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { exhaustMap, filter, map, take } from "rxjs";
import { explanationHash } from "../../domain/explanation/explanation-hash";
import { poseAnswer, questionPosed } from "../iterative-planning.actions";
import { selectExplanation, selectIterationStep } from "../iterative-planning.selector";

@Injectable()
export class QuestionQueueEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);

  postMessage$ = createEffect(() => this.actions$.pipe(
    ofType(questionPosed),
    concatLatestFrom(({iterationStepId}) => this.store.select(selectIterationStep(iterationStepId))),
    exhaustMap(([{ iterationStepId, questionType, propertyId }, iterationStep]) => {
      const hash = explanationHash(iterationStep);

      return this.store.select(selectExplanation(hash)).pipe(
        filter(({explanation}) => !!explanation),
        take(1),
        map(() => poseAnswer({iterationStepId, questionType, propertyId })),
      );
    }),
  ));

}
