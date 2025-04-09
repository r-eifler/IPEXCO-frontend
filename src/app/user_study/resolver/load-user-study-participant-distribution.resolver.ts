import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadParticipantDistribution } from '../state/user-study.actions';

export const loadUserStudyParticipantDistributionResolver: ResolveFn<void> = (snapshot) => {

  const id = snapshot.paramMap.get('participantDistributionId');

  if(id !== null)
    inject(Store).dispatch(loadParticipantDistribution({ id }))
}
