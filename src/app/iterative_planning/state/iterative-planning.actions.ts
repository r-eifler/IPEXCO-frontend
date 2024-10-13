import { createAction, props } from "@ngrx/store";
import { Project } from "src/app/project/domain/project";
import { IterationStep, ModIterationStep } from "../domain/iteration_step";
import { PlanProperty } from "../domain/plan-property/plan-property";
import { Question } from "../domain/explanation/explanations";


// Project

export const loadProject = createAction('[iterative-planning] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[iterative-planning] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[iterative-planning] load project failure');


// Plan Properties

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


// Iteration Steps

export const selectIterationStep = createAction('[iterative-planning] select iteration step', props<{iterationStepId: string}>());
export const deselectIterationStep = createAction('[iterative-planning] deselect iteration step');


export const initNewIterationStep = createAction('[iterative-planning] init new iteration step', props<{ baseStepId?: string }>());
export const updateNewIterationStep = createAction('[iterative-planning] init new iteration step', props<{ iterationStep: Partial<ModIterationStep> }>());
export const cancelNewIterationStep = createAction('[iterative-planning] cancel new iteration step');

export const loadIterationSteps = createAction('[iterative-planning] load iteration steps', props<{id: string}>());
export const loadIterationStepsSuccess = createAction('[iterative-planning] load iteration steps success', props<{iterationSteps: IterationStep[]}>());
export const loadIterationStepsFailure = createAction('[iterative-planning] load iteration steps failure');


export const createIterationStep = createAction('[iterative-planning] create iteration steps');
export const createIterationStepSuccess = createAction('[iterative-planning] create iteration steps success', props<{iterationStep: IterationStep}>());
export const createIterationStepFailure = createAction('[iterative-planning] create iteration steps failure');


// Planner

export const registerPlanComputation = createAction('[iterative-planning] register plan computation', props<{ iterationStepId: string }>());
export const registerTempGoalPlanComputation = createAction('[iterative-planning] register temp goal plan computation', props<{ iterationStepId: string }>());
export const registerPlanComputationSuccess = createAction('[iterative-planning] register plan computation success', props<{iterationStepId: string}>());
export const registerPlanComputationFailure = createAction('[iterative-planning] register plan computation failure');

export const planComputationRunning = createAction('[iterative-planning] plan computation running');
export const planComputationRunningSuccess = createAction('[iterative-planning] plan computation running success');
export const planComputationRunningFailure = createAction('[iterative-planning] plan computation running failure');


// Explainer

// Global
export const registerGlobalExplanationComputation = createAction('[iterative-planning] register global explanation computation', props<{ iterationStepId: string}>());
export const registerGlobalExplanationComputationSuccess = createAction('[iterative-planning] register global explanation computation success', props<{iterationStepId: string}>());
export const registerGlobalExplanationComputationFailure = createAction('[iterative-planning] register global explanation computation failure');

export const globalExplanationComputationRunning = createAction('[iterative-planning] global explanation computation running');
export const globalExplanationComputationRunningSuccess = createAction('[iterative-planning] global explanation computation running success');
export const globalExplanationComputationRunningFailure = createAction('[iterative-planning] global explanation computation running failure');

// Question based
export const registerExplanationComputation = createAction('[iterative-planning] register explanation computation', props<{ iterationStepId: string, question: Question }>());
export const registerExplanationComputationSuccess = createAction('[iterative-planning] register explanation computation success', props<{iterationStepId: string}>());
export const registerExplanationComputationFailure = createAction('[iterative-planning] register explanation computation failure');

export const explanationComputationRunning = createAction('[iterative-planning] explanation computation running');
export const explanationComputationRunningSuccess = createAction('[iterative-planning] explanation computation running success');
export const explanationComputationRunningFailure = createAction('[iterative-planning] explanation computation running failure');


