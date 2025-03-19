import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectPlan } from "../state/planning.actions";


export const setPlanResolver: ResolveFn<void> = (snapshot) => {
  const id = snapshot.paramMap.get('planId');

  if(id !== null)
    inject(Store).dispatch(selectPlan({ id }))
}
