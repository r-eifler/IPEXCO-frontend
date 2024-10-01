import { createAction, props } from "@ngrx/store";
import { PlanProperty } from "../domain/plan-property/plan-property";
import { Project } from "src/app/project/domain/project";
import { IterationStep, ModIterationStep } from "../domain/iteration_step";

export const loadProject = createAction('[iterative-planning] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[iterative-planning] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[iterative-planning] load project failure');


export const loadPlanProperties = createAction('[iterative-planning] load plan properties', props<{id: string}>());
export const loadPlanPropertiesSuccess = createAction('[iterative-planning] load plan properties success', props<{planProperties: Record<string,PlanProperty>}>());
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



export const selectIterationStep = createAction('[iterative-planning] select iteration step', props<{iterationStep: IterationStep}>());
export const deselectIterationStep = createAction('[iterative-planning] deselect iteration step');


export const initNewIterationStep = createAction('[iterative-planning] init new iteration step');
export const selectNewIterationStep = createAction('[iterative-planning] select new iteration step');
export const updateNewIterationStep = createAction('[iterative-planning] update new iteration step', props<{iterationStep: ModIterationStep}>());




export const loadIterationSteps = createAction('[iterative-planning] load iteration steps', props<{id: string}>());
export const loadIterationStepsSuccess = createAction('[iterative-planning] load iteration steps success', props<{iterationSteps: IterationStep[]}>());
export const loadIterationStepsFailure = createAction('[iterative-planning] load iteration steps failure');


export const createIterationStep = createAction('[iterative-planning] create iteration steps', props<{iterationStep: IterationStep}>());
export const createIterationStepSuccess = createAction('[iterative-planning] create iteration steps success', props<{iterationStep: IterationStep}>());
export const createIterationStepFailure = createAction('[iterative-planning] create iteration steps failure');




