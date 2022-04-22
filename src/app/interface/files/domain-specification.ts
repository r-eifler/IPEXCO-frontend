import { PlanPropertyTemplate } from "../plan-property/plan-property-template";
import { PlanProperty } from "../plan-property/plan-property";

export class DomainSpecification {
  public name: string;
  public planPropertyTemplates: PlanPropertyTemplate[] = [];
  public domainDescription: string;

  constructor(json) {
    this.name = json.name;
    for (const pt of json.planPropertyTemplates) {
      this.planPropertyTemplates.push(
        Object.assign(new PlanPropertyTemplate(), pt)
      );
    }
    this.domainDescription = json.domainDescription;
  }

  getPropertyTemplateClassMap(): Map<string, PlanPropertyTemplate[]> {
    const propMap = new Map<string, PlanPropertyTemplate[]>();
    for (const pt of this.planPropertyTemplates) {
      if (!propMap.has(pt.class)) {
        propMap.set(pt.class, []);
      }
      propMap.get(pt.class).push(pt);
    }
    return propMap;
  }

  getGoalDescription(goalFact: PlanProperty): string {
    return goalFact.naturalLanguageDescription;
  }
}
