import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import {executionLoadUserStudy} from '../state/user-study-execution.actions';

export const loadUserStudyExecutionResolver: ResolveFn<void> = (snapshot) => {

  console.log(snapshot.paramMap);
  const id = snapshot.paramMap.get('userStudyId');

  inject(Store).dispatch(executionLoadUserStudy({ id }))
}
