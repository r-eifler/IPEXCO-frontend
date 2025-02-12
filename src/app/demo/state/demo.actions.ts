import { createAction, props } from "@ngrx/store";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Prompt, OutputSchema } from "src/app/global_specification/domain/prompt";
import { Service } from "src/app/global_specification/domain/services";
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

export const uploadDemo = createAction('[demo] upload demo', props<{demo: Demo, planProperties: PlanProperty[], domainSpecification: DomainSpecification}>());
export const uploadDemoSuccess = createAction('[demo] upload demo success');
export const uploadDemoFailure = createAction('[demo] upload demo failure');

export const updatePlanProperty = createAction('[demo] update plan property', props<{planProperty: PlanProperty}>());
export const updatePlanPropertySuccess = createAction('[demo] update plan property success', props<{planProperty: PlanProperty}>());
export const updatePlanPropertyFailure = createAction('[demo] update plan property failure');

// domain spec
export const loadDomainSpecification = createAction('[demo] load  domain specification', props<{id: string}>());
export const loadDomainSpecificationSuccess = createAction('[demo] load  domain specification success', props<{domainSpecification: DomainSpecification}>());
export const loadDomainSpecificationFailure = createAction('[demo] load  domain specification failure');



// services
export const loadServices = createAction('[demo] load  services');
export const loadServicesSuccess = createAction('[demo] load  services success', props<{services: Service[]}>());
export const loadServicesFailure = createAction('[demo] load  services failure');


// prompts
export const loadPrompts = createAction('[demo] load  prompts');
export const loadPromptsSuccess = createAction('[demo] load  prompts success', props<{prompts: Prompt[]}>());
export const loadPromptsFailure = createAction('[demo] load  prompts failure');


// Output Schema
export const loadOutputSchemas = createAction('[demo] load  output schemas');
export const loadOutputSchemasSuccess = createAction('[demo] load  output schemas success', props<{outputSchemas: OutputSchema[]}>());
export const loadOutputSchemasFailure = createAction('[demo] load  output schemas failure');
