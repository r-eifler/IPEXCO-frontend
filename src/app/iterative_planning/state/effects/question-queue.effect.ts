import { Injectable, inject } from "@angular/core";
import { createEffect } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { includes, filter as rFilter, map as rMap } from "ramda";
import { map, switchMap } from "rxjs";
import { registerGlobalExplanationComputation } from "../iterative-planning.actions";
import { selectIterationStepIdsWithoutExplanations, selectQuestionQueue } from "../iterative-planning.selector";

@Injectable()
export class QuestionQueueEffect {
  private store = inject(Store);

  initiateExplanationComputation$ = createEffect(() => this.store.select(selectQuestionQueue).pipe(
    map(rMap(({iterationStepId}) => iterationStepId)),
    concatLatestFrom(() => this.store.select(selectIterationStepIdsWithoutExplanations)),
    map(([queuedIterationStepIds, explanationsMissing]) => rFilter(missingId => includes(missingId, queuedIterationStepIds), explanationsMissing)),
    switchMap(missingIterationIds => rMap(iterationStepId => registerGlobalExplanationComputation({ iterationStepId }), missingIterationIds)),
  ));


}
