import { createAction, props } from "@ngrx/store";
import { PlanProperty } from "../domain/plan-property/plan-property";
import { Project } from "src/app/project/domain/project";

export const loadProject = createAction('[iterative-planning] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[iterative-planning] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[iterative-planning] load project failure');


export const loadPlanProperties = createAction('[iterative-planning] load plan properties', props<{id: string}>());
export const loadPlanPropertiesSuccess = createAction('[iterative-planning] load plan properties success', props<{planProperties: PlanProperty[]}>());
export const loadPlanPropertiesFailure = createAction('[iterative-planning] load plan properties failure');


export const createPlanProperty = createAction('[iterative-planning] create plan property', props<{planProperty: PlanProperty}>());
export const createPlanPropertySuccess = createAction('[iterative-planning] create plan property success', props<{planProperty: PlanProperty}>());
export const createPlanPropertyFailure = createAction('[iterative-planning] create plan property failure');


export const updatePlanProperty = createAction('[iterative-planning] update plan property', props<{planProperty: PlanProperty}>());
export const updatePlanPropertySuccess = createAction('[iterative-planning] update plan property success', props<{planProperty: PlanProperty}>());
export const updatePlanPropertyFailure = createAction('[iterative-planning] update plan property failure');

export const deletePlanProperty = createAction('[iterative-planning] delete plan property', props<{id: string}>());
export const deletePlanPropertySuccess = createAction('[iterative-planning] delete plan property success', props<{res: boolean}>());
export const deletePlanPropertyFailure = createAction('[iterative-planning] delete plan property failure');


