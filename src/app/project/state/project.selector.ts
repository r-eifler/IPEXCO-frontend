import { createFeatureSelector, createSelector } from "@ngrx/store";
import { projectFeature, ProjectState } from "./project.reducer";


const selectProjectFeature = createFeatureSelector<ProjectState>(projectFeature);

export const selectProjects = createSelector(selectProjectFeature, (state) => state.projects.data)