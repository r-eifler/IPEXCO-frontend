import { createAction, props } from "@ngrx/store";
import { Project } from "../domain/project";

export const loadProjectList = createAction('[project] load project list');

export const loadProjectListSuccess = createAction('[project] load project list success', props<{projects: Project[]}>());
export const loadProjectListFailure = createAction('[project] load project list failure');
