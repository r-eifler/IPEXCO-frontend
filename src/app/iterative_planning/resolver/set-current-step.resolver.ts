import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectIterationStep } from "../state/iterative-planning.actions";

export const setCurrentStepResolver: ResolveFn<void> = (snapshot) => {
  const iterationStepId = snapshot.paramMap.get('stepId');

  if(iterationStepId !== null)
    inject(Store).dispatch(selectIterationStep({ iterationStepId }))
}
