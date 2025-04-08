import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectPlanComp, selectPlanRef } from "../state/planning.actions";


export const setComparePlansResolver: ResolveFn<void> = (snapshot) => {
  const idRef = snapshot.paramMap.get('planId');
  const idComp = snapshot.paramMap.get('planIdComp');

  if(idRef !== null && idComp !== null){
    inject(Store).dispatch(selectPlanRef({ id: idRef }))
    inject(Store).dispatch(selectPlanComp({ id: idComp }))
  }
}
