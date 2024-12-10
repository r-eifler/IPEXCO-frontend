import { createAction, props } from "@ngrx/store";
import { ProjectMetaData } from "../domain/project-meta";
import { Project } from "src/app/shared/domain/project";

export const loadProjectMetaDataList = createAction('[project-meta] load project meta data list');
export const loadProjectMetaDataListSuccess = createAction('[project-meta] load project meta data list success', 
    props<{projects: ProjectMetaData[]}>());
export const loadProjectMetaDataListFailure = createAction('[project-meta] load project meta data list failure');

export const createProject = createAction('[create-project] create new project', 
    props<{project: Project}>());
export const createProjectSuccess = createAction('[create-project] create new project success');
export const createProjectFailure = createAction('[create-project] create new project failure');

export const deleteProject = createAction('[delete-project] delete project', 
    props<{id: string}>());
export const deleteProjectSuccess = createAction('[delete-project] delete project success');
export const deleteProjectFailure = createAction('[delete-project] delete project failure');
