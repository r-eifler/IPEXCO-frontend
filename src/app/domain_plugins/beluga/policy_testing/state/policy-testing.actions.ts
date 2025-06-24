import { createAction, props } from "@ngrx/store";
import { Project } from "src/app/shared/domain/project";

// project

export const loadProject = createAction('[policy-testing] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[policy-testing] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[policy-testing] load project failure', props<{err: any}>());

