import {ActionReducerMap} from '@ngrx/store';

import {routerReducer} from '@ngrx/router-store';
import {AppState} from '../state/app.state';
import {domainFileReducers} from './domain-file.reducers';

export const appReducers: ActionReducerMap<AppState, any> = {
  router: routerReducer,
  domainFiles: domainFileReducers,
};
