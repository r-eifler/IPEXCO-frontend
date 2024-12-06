import { createFeatureSelector, createSelector } from '@ngrx/store';
import {userStudyFeature, UserStudyState} from './user-study.reducer';


const selectUserStudyFeature = createFeatureSelector<UserStudyState>(userStudyFeature);

export const selectUserStudies = createSelector(selectUserStudyFeature, (state) => state.userStudies?.data)

export const selectUserStudyDemos = createSelector(selectUserStudyFeature, (state) => state.demos)
