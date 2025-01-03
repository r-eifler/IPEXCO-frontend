import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import {distributeParticipant} from '../state/user-study-execution.actions';

export const distributeParticipantsResolver: ResolveFn<void> = (snapshot) => {

  const id = snapshot.paramMap.get('distributionId');

  inject(Store).dispatch(distributeParticipant({ distributionId: id }))
}
