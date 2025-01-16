import { createAction, props } from "@ngrx/store";
import { Demo } from "src/app/project/domain/demo";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { Project } from "src/app/shared/domain/project";

// project

export const loadProject = createAction('[project] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[project] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[project] load project failure');


export const updateProject = createAction('[project] update project', props<{project: Project}>());
export const updateProjectSuccess = createAction('[project] update project success', props<{project: Project}>());
export const updateProjectFailure = createAction('[project] update project failure');


// Plan Properties

export const loadPlanProperties = createAction('[project] load plan properties', props<{id: string}>());
export const loadPlanPropertiesSuccess = createAction('[project] load plan properties success', props<{planProperties: Record<string,PlanProperty>}>());
export const loadPlanPropertiesFailure = createAction('[project] load plan properties failure');


export const createPlanProperty = createAction('[project] create plan property', props<{planProperty: PlanProperty}>());
export const createPlanPropertySuccess = createAction('[project] create plan property success', props<{planProperty: PlanProperty}>());
export const createPlanPropertyFailure = createAction('[project] create plan property failure');


export const updatePlanProperty = createAction('[project] update plan property', props<{planProperty: PlanProperty}>());
export const updatePlanPropertySuccess = createAction('[project] update plan property success', props<{planProperty: PlanProperty}>());
export const updatePlanPropertyFailure = createAction('[project] update plan property failure');

export const deletePlanProperty = createAction('[project] delete plan property', props<{id: string}>());
export const deletePlanPropertySuccess = createAction('[project] delete plan property success', props<{res: boolean}>());
export const deletePlanPropertyFailure = createAction('[project] delete plan property failure');


// demos

export const updateDemo = createAction('[project] update demo', props<{demo: Demo}>());
export const updateDemoSuccess = createAction('[project] update demo success', props<{demo: Demo}>());
export const updateDemoFailure = createAction('[project] update demo failure');

export const loadProjectDemos = createAction('[project] load project demos', props<{id: string}>());
export const loadProjectDemosSuccess = createAction('[project] load project demos success', props<{demos: Demo[]}>());
export const loadProjectDemosFailure = createAction('[project] load project demos failure');

export const uploadProjectDemoImage = createAction('[project] upload project demo image', props<{image: any}>());
export const uploadProjectDemoImageSuccess = createAction('[project] upload project demo image success', props<{imagePath: string}>());
export const uploadProjectDemoImageFailure = createAction('[project] upload project demo image failure');

export const registerDemoCreation = createAction('[project] register demo creation', props<{demo: Demo, properties: PlanProperty[]}>());
export const registerDemoCreationSuccess = createAction('[project] register demo creation success', props<{id: string}>());
export const registerDemoCreationFailure = createAction('[project] register demo creation failure');

export const cancelDemoCreation = createAction('[project] cancel demo creation', props<{demoId: string}>());
export const cancelDemoCreationSuccess = createAction('[project] cancel demo creation success');
export const cancelDemoCreationFailure = createAction('[project] cancel demo creation failure');

export const demoCreationRunning = createAction('[project] demo creation running', props<{id: string}>());
export const demoCreationRunningSuccess = createAction('[project] demo creation running');
export const demoCreationRunningFailure = createAction('[project] demo creation running');

export const deleteProjectDemo = createAction('[project] delete project demos', props<{id: string}>());
export const deleteProjectDemoSuccess = createAction('[project] delete project demos success');
export const deleteProjectDemoFailure = createAction('[project] delete project demos failure');

export const loadAllDemosPlanProperties = createAction('[project] load all demo plan properties');
export const loadDemoPlanProperties = createAction('[project] load demo plan properties', props<{id: string}>());
export const loadDemoPlanPropertiesSuccess = createAction('[project] load demo plan properties success', props<{demoId: string, planProperties: PlanProperty[]}>());
export const loadDemoPlanPropertiesFailure = createAction('[project] load demo plan properties failure');

export const loadProjectDemo = createAction('[project] load project demo', props<{id: string}>());
export const loadProjectDemoSuccess = createAction('[project] load project demo success', props<{demo: Demo}>());
export const loadProjectDemoFailure = createAction('[project] load project demo failure');