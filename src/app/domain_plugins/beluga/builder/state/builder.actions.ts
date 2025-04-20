import { createAction, props } from "@ngrx/store";
import { Project } from "src/app/shared/domain/project";


export const loadProject = createAction('[beluga-builder] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[beluga-builder] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[beluga-builder] load project failure', props<{err: any}>());
