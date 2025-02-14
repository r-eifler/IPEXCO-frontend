import { createAction, props } from "@ngrx/store";
import { DomainSpecification } from "../domain/domain_specification";
import { OutputSchema, Prompt } from "../domain/prompt";
import { Service } from "../domain/services";



// domain specifications

export const loadDomainSpecifications = createAction('[global specification] load  domain specifications');
export const loadDomainSpecificationsSuccess = createAction('[global specification] load  domain specifications success', props<{domainSpecifications: DomainSpecification[]}>());
export const loadDomainSpecificationsFailure = createAction('[global specification] load  domain specifications failure', props<{err: any}>());

export const loadDomainSpecification = createAction('[global specification] load  domain specification', props<{id: string}>());
export const loadDomainSpecificationSuccess = createAction('[global specification] load  domain specification success', props<{domainSpecification: DomainSpecification}>());
export const loadDomainSpecificationFailure = createAction('[global specification] load  domain specification failure', props<{err: any}>());

export const createDomainSpecification = createAction('[global specification] create  domainSpecification', props<{domainSpecification: DomainSpecification}>());
export const createDomainSpecificationSuccess = createAction('[global specification] create  domainSpecification success', props<{domainSpecification: DomainSpecification}>());
export const createDomainSpecificationFailure = createAction('[global specification] create  domainSpecification failure', props<{err: any}>());

export const deleteDomainSpecification = createAction('[global specification] delete  domain specifications', props<{id: string}>());
export const deleteDomainSpecificationSuccess = createAction('[global specification] delete  domain specifications success');
export const deleteDomainSpecificationFailure = createAction('[global specification] delete  domain specifications failure', props<{err: any}>());

export const updateDomainSpecification = createAction('[global specification] update domain specification', props<{domainSpecification: DomainSpecification}>());
export const updateDomainSpecificationSuccess = createAction('[global specification] update domain specification success', props<{domainSpecification: DomainSpecification}>());
export const updateDomainSpecificationFailure = createAction('[global specification] update domain specification failure', props<{err: any}>());




// prompts

export const loadPrompts = createAction('[global specification] load  prompts');
export const loadPromptsSuccess = createAction('[global specification] load  prompts success', props<{prompts: Prompt[]}>());
export const loadPromptsFailure = createAction('[global specification] load  prompts failure', props<{err: any}>());

export const loadPrompt = createAction('[global specification] load  prompt', props<{id: string}>());
export const loadPromptSuccess = createAction('[global specification] load  prompt success', props<{prompt: Prompt}>());
export const loadPromptFailure = createAction('[global specification] load  prompt failure', props<{err: any}>());

export const createPrompt = createAction('[global specification] create  prompt', props<{prompt: Prompt}>());
export const createPromptSuccess = createAction('[global specification] create  prompt success', props<{prompt: Prompt}>());
export const createPromptFailure = createAction('[global specification] create  prompt failure', props<{err: any}>());

export const deletePrompt = createAction('[global specification] delete  prompts', props<{id: string}>());
export const deletePromptSuccess = createAction('[global specification] delete  prompts success');
export const deletePromptFailure = createAction('[global specification] delete  prompts failure', props<{err: any}>());

export const updatePrompt = createAction('[global specification] update prompt', props<{prompt: Prompt}>());
export const updatePromptSuccess = createAction('[global specification] update prompt success', props<{prompt: Prompt}>());
export const updatePromptFailure = createAction('[global specification] update prompt failure', props<{err: any}>());

// Output Schema
export const loadOutputSchemas = createAction('[global specification] load  output schemas');
export const loadOutputSchemasSuccess = createAction('[global specification] load  output schemas success', props<{outputSchemas: OutputSchema[]}>());
export const loadOutputSchemasFailure = createAction('[global specification] load  output schemas failure', props<{err: any}>());

export const loadOutputSchema = createAction('[global specification] load  output schema', props<{id: string}>());
export const loadOutputSchemaSuccess = createAction('[global specification] load  output schema success', props<{outputSchema: OutputSchema}>());
export const loadOutputSchemaFailure = createAction('[global specification] load  output schema failure', props<{err: any}>());

export const createOutputSchema = createAction('[global specification] create  output schema', props<{outputSchema: OutputSchema}>());
export const createOutputSchemaSuccess = createAction('[global specification] create  output schema success', props<{outputSchema: OutputSchema}>());
export const createOutputSchemaFailure = createAction('[global specification] create  output schema failure', props<{err: any}>());

export const deleteOutputSchema = createAction('[global specification] delete  output schemas', props<{id: string}>());
export const deleteOutputSchemaSuccess = createAction('[global specification] delete  output schemas success');
export const deleteOutputSchemaFailure = createAction('[global specification] delete  output schemas failure', props<{err: any}>());

export const updateOutputSchema = createAction('[global specification] update output schema', props<{outputSchema: OutputSchema}>());
export const updateOutputSchemaSuccess = createAction('[global specification] update output schema success', props<{outputSchema: OutputSchema}>());
export const updateOutputSchemaFailure = createAction('[global specification] update output schema failure', props<{err: any}>());




// service

export const loadServices = createAction('[global specification] load  services');
export const loadServicesSuccess = createAction('[global specification] load  services success', props<{services: Service[]}>());
export const loadServicesFailure = createAction('[global specification] load  services failure', props<{err: any}>());

export const createService = createAction('[global specification] create  service', props<{service: Service}>());
export const createServiceSuccess = createAction('[global specification] create  service success', props<{service: Service}>());
export const createServiceFailure = createAction('[global specification] create  service failure', props<{err: any}>());

export const deleteService = createAction('[global specification] delete  services', props<{id: string}>());
export const deleteServiceSuccess = createAction('[global specification] delete  services success');
export const deleteServiceFailure = createAction('[global specification] delete  services failure', props<{err: any}>());

export const updateService = createAction('[global specification] update service', props<{services: Service}>());
export const updateServiceSuccess = createAction('[global specification] update service success', props<{service: Service}>());
export const updateServiceFailure = createAction('[global specification] update service failure', props<{err: any}>());

