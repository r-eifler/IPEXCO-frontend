import {RouterReducerState} from '@ngrx/router-store';

import {DomainFileState, initialDomainFileState} from './domain-file.state';

export interface AppState {
  router?: RouterReducerState;
  domainFiles: DomainFileState;
}
export const initialAppState: AppState = {
  domainFiles: initialDomainFileState,
};

export function getInitialState(): AppState {
  return initialAppState;
}
