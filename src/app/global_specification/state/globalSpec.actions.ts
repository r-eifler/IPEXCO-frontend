import { createAction, props } from "@ngrx/store";
import { DomainSpecification } from "../domain/domain_specification";
import { Prompt } from "../domain/prompt";
import { Explainer, Planner } from "../domain/services";



// domain specifications

export const loadDomainSpecifications = createAction('[global specification] load  domain specifications');
export const loadDomainSpecificationsSuccess = createAction('[global specification] load  domain specifications success', props<{domainSpecifications: DomainSpecification[]}>());
export const loadDomainSpecificationsFailure = createAction('[global specification] load  domain specifications failure');

export const createDomainSpecification = createAction('[global specification] create  domainSpecification', props<{domainSpecification: DomainSpecification}>());
export const createDomainSpecificationSuccess = createAction('[global specification] create  domainSpecification success', props<{domainSpecification: DomainSpecification}>());
export const createDomainSpecificationFailure = createAction('[global specification] create  domainSpecification failure');

export const deleteDomainSpecification = createAction('[global specification] delete  domain specifications', props<{id: string}>());
export const deleteDomainSpecificationSuccess = createAction('[global specification] delete  domain specifications success');
export const deleteDomainSpecificationFailure = createAction('[global specification] delete  domain specifications failure');

export const updateDomainSpecification = createAction('[global specification] update domain specification', props<{domainSpecification: DomainSpecification}>());
export const updateDomainSpecificationSuccess = createAction('[global specification] update domain specification success', props<{domainSpecification: DomainSpecification}>());
export const updateDomainSpecificationFailure = createAction('[global specification] update domain specification failure');




// prompts

export const loadPrompts = createAction('[global specification] load  prompts');
export const loadPromptsSuccess = createAction('[global specification] load  prompts success', props<{prompts: Prompt[]}>());
export const loadPromptsFailure = createAction('[global specification] load  prompts failure');

export const createPrompt = createAction('[global specification] create  prompt', props<{prompt: Prompt}>());
export const createPromptSuccess = createAction('[global specification] create  prompt success', props<{prompt: Prompt}>());
export const createPromptFailure = createAction('[global specification] create  prompt failure');

export const deletePrompt = createAction('[global specification] delete  prompts', props<{id: string}>());
export const deletePromptSuccess = createAction('[global specification] delete  prompts success');
export const deletePromptFailure = createAction('[global specification] delete  prompts failure');

export const updatePrompt = createAction('[global specification] update prompt', props<{prompts: Prompt}>());
export const updatePromptSuccess = createAction('[global specification] update prompt success', props<{prompts: Prompt}>());
export const updatePromptFailure = createAction('[global specification] update prompt failure');




// planner

export const loadPlanners = createAction('[global specification] load  planners');
export const loadPlannersSuccess = createAction('[global specification] load  planners success', props<{planners: Planner[]}>());
export const loadPlannersFailure = createAction('[global specification] load  planners failure');

export const createPlanner = createAction('[global specification] create  planner', props<{planner: Planner}>());
export const createPlannerSuccess = createAction('[global specification] create  planner success', props<{planner: Planner}>());
export const createPlannerFailure = createAction('[global specification] create  planner failure');

export const deletePlanner = createAction('[global specification] delete  planners', props<{id: string}>());
export const deletePlannerSuccess = createAction('[global specification] delete  planners success');
export const deletePlannerFailure = createAction('[global specification] delete  planners failure');

export const updatePlanner = createAction('[global specification] update planner', props<{planners: Planner}>());
export const updatePlannerSuccess = createAction('[global specification] update planner success', props<{planner: Planner}>());
export const updatePlannerFailure = createAction('[global specification] update planner failure');



// explainer

export const loadExplainers = createAction('[global specification] load  explainers');
export const loadExplainersSuccess = createAction('[global specification] load  explainers success', props<{explainers: Explainer[]}>());
export const loadExplainersFailure = createAction('[global specification] load  explainers failure');

export const createExplainer = createAction('[global specification] create  explainer', props<{explainer: Explainer}>());
export const createExplainerSuccess = createAction('[global specification] create  explainer success', props<{explainer: Explainer}>());
export const createExplainerFailure = createAction('[global specification] create  explainer failure');

export const deleteExplainer = createAction('[global specification] delete  explainers', props<{id: string}>());
export const deleteExplainerSuccess = createAction('[global specification] delete  explainers success');
export const deleteExplainerFailure = createAction('[global specification] delete  explainers failure');

export const updateExplainer = createAction('[global specification] update explainer', props<{explainers: Explainer}>());
export const updateExplainerSuccess = createAction('[global specification] update explainer success', props<{explainer: Explainer}>());
export const updateExplainerFailure = createAction('[global specification] update explainer failure');