import { PlanPropertyTemplate } from "./plan-property/plan-property-template";

export interface DomainSpecification {
  name: string;
  planPropertyTemplates: PlanPropertyTemplate[]  ;
  domainDescription: string;
}

export const defaultDomainSpecification = {
  name: '', 
  planPropertyTemplates: [], 
  domainDescription: ''
}
