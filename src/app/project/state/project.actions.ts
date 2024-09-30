import { createAction, props } from "@ngrx/store";
import { Project } from "../domain/project";
import { GeneralSettings } from "src/app/interface/settings/general-settings";

export const loadProject = createAction('[project] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[project] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[project] load project failure');



export const updateProject = createAction('[project] update project', props<{project: Project}>());
export const updateProjectSuccess = createAction('[project] update project success', props<{project: Project}>());
export const updateProjectFailure = createAction('[project] update project failure');

