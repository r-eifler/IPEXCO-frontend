import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadUserStudy } from '../state/user-study.actions';

export const loadUserStudyResolver: ResolveFn<void> = (snapshot) => {

  const id = snapshot.paramMap.get('userStudyId');

  if(id !== null)
    inject(Store).dispatch(loadUserStudy({ id }))
}
