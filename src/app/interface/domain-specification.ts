import { variable } from '@angular/compiler/src/output/output_ast';
import { PlanPropertyTemplate } from './plan-property-template';
import { Goal, GoalType } from './goal';
import { PlanProperty } from './plan-property';

interface NaturalLanguageDescriptionMapping {
  predicatName: string;
  args: string[];
  description: string;
}

interface NaturalLanguageDescription {
  goal: NaturalLanguageDescriptionMapping[];
}

export class DomainSpecification {

  public name: string;
  public objectRepresentation: any[];
  public planPropertyTemplates: PlanPropertyTemplate[] = [];
  public naturalLanguageDescription: NaturalLanguageDescription;


  constructor(json) {
    this.name = json.name;
    this.objectRepresentation = json.objectRepresentation;
    for (const pt of json.planPropertyTemplates) {
      this.planPropertyTemplates.push(Object.assign(new PlanPropertyTemplate(), pt));
    }
    this.naturalLanguageDescription = json.naturalLanguageDescription;
  }

  getPropertyTemplateClassMap(): Map<string, PlanPropertyTemplate[]> {
    const propMap = new Map<string, PlanPropertyTemplate[]>();
    for (const pt of this.planPropertyTemplates) {
      if (! propMap.has(pt.class)) {
        propMap.set(pt.class, []);
      }
      propMap.get(pt.class).push(pt);
    }
    return propMap;
  }

  getGoalDescription(goalFact: Goal): string {
    if (goalFact.goalType === GoalType.planProperty) {
      const planProperty: PlanProperty = goalFact as PlanProperty;
      return planProperty.naturalLanguageDescription;
    }
    if (goalFact.goalType === GoalType.goalFact) {
      for (const mapping of this.naturalLanguageDescription.goal) {
          if (goalFact.name.startsWith(mapping.predicatName)) {
            const args: string[] = goalFact.name.split('(')[1].replace(')', '').split(',');
            let description = mapping.description;
            for (let i = 0; i < args.length; i++) {
              description = description.replace(mapping.args[i], args[i]);
            }
            goalFact.naturalLanguage = description;
            return description;
          }
      }
      return goalFact.name;
    }
  }
}
