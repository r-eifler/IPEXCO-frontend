import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import {executionLoadUserStudy, executionSelectUserStudyStep} from '../state/user-study-execution.actions';

export const loadUserStudyExecutionStepResolver: ResolveFn<void> = (snapshot) => {

  console.log(snapshot.paramMap);
  const id = snapshot.paramMap.get('stepId');

  inject(Store).dispatch(executionSelectUserStudyStep({index: Number(id)}))
}
