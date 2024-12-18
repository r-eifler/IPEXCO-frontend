import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadParticipantDistribution } from '../state/user-study.actions';

export const loadUserStudyParticipantDistributionResolver: ResolveFn<void> = (snapshot) => {

  console.log(snapshot.paramMap);
  const id = snapshot.paramMap.get('participantDistributionId');

  inject(Store).dispatch(loadParticipantDistribution({ id }))
}
