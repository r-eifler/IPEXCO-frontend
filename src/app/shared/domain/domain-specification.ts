import { AllLLMConfig, defaultAllLLMConfig } from "./llm-config";
import { PlanPropertyTemplate } from "./plan-property/plan-property-template";

export interface DomainSpecification {
  name: string;
  planPropertyTemplates: PlanPropertyTemplate[]  ;
  domainDescription: string;
  llmConfig: AllLLMConfig;
}

export const defaultDomainSpecification = {
  name: '', 
  planPropertyTemplates: [], 
  domainDescription: '',
  llmConfig: defaultAllLLMConfig,
}
