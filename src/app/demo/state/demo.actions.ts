import { createAction, props } from "@ngrx/store";
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