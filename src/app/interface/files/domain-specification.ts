import { PlanPropertyTemplate } from "../../iterative_planning/domain/plan-property/plan-property-template";
import { PlanProperty } from "../../iterative_planning/domain/plan-property/plan-property";

export interface DomainSpecification {
  name: string;
  planPropertyTemplates: PlanPropertyTemplate[]  ;
  domainDescription: string;
}

export function getPropertyTemplateClassMap(domainSpec: DomainSpecification): Map<string, PlanPropertyTemplate[]> {
    const propMap = new Map<string, PlanPropertyTemplate[]>();
    for (const pt of domainSpec.planPropertyTemplates) {
      if (!propMap.has(pt.class)) {
        propMap.set(pt.class, []);
      }
      propMap.get(pt.class).push(pt);
    }
    return propMap;
  }

export function getGoalDescription(goalFact: PlanProperty): string {
  return goalFact.naturalLanguageDescription;
}


export const defaultDomainSpecification = {
  name: '', 
  planPropertyTemplates: [], 
  domainDescription: ''
}
