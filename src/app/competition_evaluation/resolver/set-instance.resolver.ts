import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectEvaluationInstance } from "../state/competition_evaluation.actions";


export const setInstanceResolver: ResolveFn<void> = (snapshot) => {
  const id = snapshot.paramMap.get('id');

  if(id !== null)
    inject(Store).dispatch(selectEvaluationInstance({ id }))
}
