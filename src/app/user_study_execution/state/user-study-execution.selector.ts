import { createFeatureSelector, createSelector } from '@ngrx/store';
import {userStudyExecutionFeature, UserStudyExecutionState} from './user-study-execution.reducer';

const selectUserStudyExecutionFeature = createFeatureSelector<UserStudyExecutionState>(userStudyExecutionFeature);

export const selectExecutionUserStudy = createSelector(selectUserStudyExecutionFeature, (state) => state.userStudy?.data)
