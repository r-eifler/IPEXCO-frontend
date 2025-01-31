import { createAction, props } from "@ngrx/store";
import { Prompt, OutputSchema } from "src/app/global_specification/domain/prompt";
import { Explainer, Planner } from "src/app/global_specification/domain/services";
import { Demo } from "src/app/shared/domain/demo";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";



// demos

export const loadDemos = createAction('[demo] load  demos');
export const loadDemosSuccess = createAction('[demo] load  demos success', props<{demos: Demo[]}>());
export const loadDemosFailure = createAction('[demo] load  demos failure');

export const deleteDemo = createAction('[demo] delete  demos', props<{id: string}>());
export const deleteDemoSuccess = createAction('[demo] delete  demos success');
export const deleteDemoFailure = createAction('[demo] delete  demos failure');

export const loadAllDemosPlanProperties = createAction('[demo] load all demo plan properties');
export const loadDemoPlanProperties = createAction('[demo] load demo plan properties', props<{id: string}>());
export const loadDemoPlanPropertiesSuccess = createAction('[demo] load demo plan properties success', props<{demoId: string, planProperties: PlanProperty[]}>());
export const loadDemoPlanPropertiesFailure = createAction('[demo] load demo plan properties failure');

export const loadDemo = createAction('[demo] load  demo', props<{id: string}>());
export const loadDemoSuccess = createAction('[demo] load  demo success', props<{demo: Demo}>());
export const loadDemoFailure = createAction('[demo] load  demo failure');

export const updateDemo = createAction('[demo] update demo', props<{demo: Demo}>());
export const updateDemoSuccess = createAction('[demo] update demo success', props<{demo: Demo}>());
export const updateDemoFailure = createAction('[demo] update demo failure');

export const uploadDemo = createAction('[demo] upload demo', props<{demo: Demo, planProperties: PlanProperty[]}>());
export const uploadDemoSuccess = createAction('[demo] upload demo success');
export const uploadDemoFailure = createAction('[demo] upload demo failure');

export const updatePlanProperty = createAction('[demo] update plan property', props<{planProperty: PlanProperty}>());
export const updatePlanPropertySuccess = createAction('[demo] update plan property success', props<{planProperty: PlanProperty}>());
export const updatePlanPropertyFailure = createAction('[demo] update plan property failure');


// planner
export const loadPlanners = createAction('[demo] load  planners');
export const loadPlannersSuccess = createAction('[demo] load  planners success', props<{planners: Planner[]}>());
export const loadPlannersFailure = createAction('[demo] load  planners failure');


// explainer
export const loadExplainers = createAction('[demo] load  explainers');
export const loadExplainersSuccess = createAction('[demo] load  explainers success', props<{explainers: Explainer[]}>());
export const loadExplainersFailure = createAction('[demo] load  explainers failure');


// prompts
export const loadPrompts = createAction('[demo] load  prompts');
export const loadPromptsSuccess = createAction('[demo] load  prompts success', props<{prompts: Prompt[]}>());
export const loadPromptsFailure = createAction('[demo] load  prompts failure');


// Output Schema
export const loadOutputSchemas = createAction('[demo] load  output schemas');
export const loadOutputSchemasSuccess = createAction('[demo] load  output schemas success', props<{outputSchemas: OutputSchema[]}>());
export const loadOutputSchemasFailure = createAction('[demo] load  output schemas failure');
