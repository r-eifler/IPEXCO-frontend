import { PDDLFact, FactToString, PlanningTask } from "src/app/interface/planning-task";
import { Action, ActionSet, GoalType, PlanProperty, toAction } from "src/app/iterative_planning/domain/plan-property/plan-property";
import { Project } from "src/app/project/domain/project";

export interface PlanPropertyTemplate {
  class: string;
  type: GoalType;
  variables: {
    name: string;
    type: string | string[];
  }[];
  nameTemplate: string;
  formulaTemplate: string;
  actionSetsTemplates: ActionSetsTemplates[];
  sentenceTemplate: string;
  initVariableConstraints: string[];
  goalVariableConstraints: string[];
}

export const defaultPlanPropertyTemplate = {
  class: 'None',
  type: GoalType.goalFact,
  variables: [],
  nameTemplate: 'new template',
  formulaTemplate: '',
  actionSetsTemplates: [],
  sentenceTemplate: '',
  initVariableConstraints: [],
  goalVariableConstraints:[],
}

export interface TemplateProgress {
  constraintDomains: ConstraintDomains;
  numSelectableVariables: number;
}

export function getSentenceTemplateParts(template: PlanPropertyTemplate, progress: TemplateProgress): string[] {// [string[], TemplateProgress] {
    let numSelectableVariables = 0;
    const parts: string[] = [""];
    for (const word of template.sentenceTemplate.split(" ")) {
      if (word.startsWith("$")) {
        parts.push(word);
        parts.push("");
        numSelectableVariables++;
      } else {
        parts[parts.length - 1] = parts[parts.length - 1] + " " + word;
      }
    }
    // console.log(parts);
    progress.numSelectableVariables = numSelectableVariables;
    return parts;
    // return [parts, progress];
  }

export function initializeVariableConstraints(task: PlanningTask, template: PlanPropertyTemplate, progress: TemplateProgress): TemplateProgress {
    const varValues = getPossibleTypeVariableDomains(template, task);
    for (const entry1 of varValues.entries()) {
      progress.constraintDomains.addNewVar(entry1[0], entry1[1]);
      for (const v of entry1[1]) {
        for (const entry2 of varValues.entries()) {
          if (entry2[0] !== entry1[0]) {
            const constrainigVar = { name: entry1[0], value: v };
            const constrainedVar = {
              name: entry2[0],
              values: [],
            };
            const constrained = getConstraintSatValues(
              constrainigVar,
              constrainedVar,
              template.initVariableConstraints,
              task.model.initial
            );
            if (constrained) {
              progress.constraintDomains.addVarValuePossibleValues(
                constrainigVar.name,
                constrainigVar.value,
                constrainedVar.name,
                constrainedVar.values
              );
            } else {
              progress.constraintDomains.addVarValuePossibleValues(
                constrainigVar.name,
                constrainigVar.value,
                constrainedVar.name,
                varValues.get(constrainedVar.name)
              );
            }
          } else {
            progress.constraintDomains.addVarValuePossibleValues(
              entry1[0],
              v,
              entry1[0],
              varValues.get(entry1[0])
            );
          }
        }
      }
    }
    return progress
  }

export function generatePlanProperty(
    template: PlanPropertyTemplate,
    progress: TemplateProgress,
    varValueMapping: Map<string, string>,
    task: PlanningTask,
    project: Project
  ): PlanProperty {
    
    completeVarValueMapping(template, varValueMapping, task);

    let name = template.nameTemplate;
    let formula = template.formulaTemplate;
    let naturalLanguageDescription = template.sentenceTemplate;

    for (const pair of varValueMapping.entries()) {
      const regex = new RegExp(pair[0].replace("$", "\\$"), "g");
      formula = formula.replace(regex, pair[1]);
      name = name.replace(regex, pair[1]);
      naturalLanguageDescription = naturalLanguageDescription.replace(
        regex,
        pair[1]
      );
    }

    const actionSets: ActionSet[] = [];
    for (const actionSetT of template.actionSetsTemplates) {
      const actions: Action[] = [];
      for (let actionT of actionSetT.actionTemplates) {
        for (const pair of varValueMapping.entries()) {
          actionT = actionT.replace(pair[0], pair[1]);
        }
        actions.push(toAction(actionT));
      }
      actionSets.push({ name: actionSetT.name, actions });
    }

    return {
      name,
      type: template.type,
      formula,
      actionSets,
      naturalLanguageDescription,
      project: project._id,
      isUsed: false,
      globalHardGoal: false,
      utility: 1,
      color: "#696969",
      icon: "star",
      class: template.class
    };
  }

export function completeVarValueMapping(
    template: PlanPropertyTemplate,
    varValueMapping: Map<string, string>,
    task: PlanningTask
  ) {
    for (const variable of template.variables) {
      if (!varValueMapping.has(variable.name)) {
        varValueMapping.set(
          variable.name,
          findVarValue(template, variable.name, varValueMapping, task)
        );
      }
    }
  }

export function findVarValue(
    template: PlanPropertyTemplate,
    varName: string,
    varValueMapping: Map<string, string>,
    task: PlanningTask
  ): string {
    for (const constraint of template.goalVariableConstraints) {
      if (constraint.includes(varName)) {
        let constraintInstance = constraint.replace("(", "\\(");
        constraintInstance = constraintInstance.replace(")", "\\)");
        constraintInstance = constraintInstance.replace(varName, "(\\w+)");
        for (const pair of varValueMapping.entries()) {
          constraintInstance = constraintInstance.replace(pair[0], pair[1]);
        }
        const regex = RegExp(constraintInstance);
        for (const goal of task.model.goal) {
          const match = regex.exec(goal.name);
          if (match) {
            return match[1];
          }
        }
      }
    }
    throw Error("Variable " + varName + " has no value.");
  }

export function getPossibleTypeVariableDomains(
    template: PlanPropertyTemplate,
    task: PlanningTask
  ): Map<string, string[]> {
    // get all values which have the right type
    const map = new Map<string, string[]>();
    for (const variable of template.variables) {
      const matchingObjects: string[] = [];
      for (const obj of task.model.objects) {
        if (variable.type.length === 1 && obj.type === variable.type) {
          matchingObjects.push(obj.name);
        }
        if (variable.type.length > 1 && variable.type.includes(obj.type)) {
          matchingObjects.push(obj.name);
        }
      }
      map.set(variable.name, matchingObjects);
    }
    return map;
  }

  export  function getPossibleVariableValues(
    template: PlanPropertyTemplate,
    progress: TemplateProgress,
    task: PlanningTask,
    varValueMapping: Map<string, string>
  ): Map<string, string[]> {

    let possibleValues: Map<string, string[]> = getPossibleTypeVariableDomains(template, task);

    for (const variable of varValueMapping.keys()) {
      const currentValue = varValueMapping.get(variable);

      possibleValues = domainIntersection(
        possibleValues,
        progress.constraintDomains.getVarValuePossibleValues(variable, currentValue)
      );
    }
    return possibleValues;
  }

export interface ActionSetsTemplates {
  name: string;
  actionTemplates: string[];
}

export class ConstraintDomains {
  private map: Map<string, Map<string, Map<string, string[]>>> = new Map();

  addNewVar(name: string, values: string[]) {
    const valueMaps: Map<string, Map<string, string[]>> = new Map();
    for (const v of values) {
      valueMaps.set(v, new Map());
    }
    this.map.set(name, valueMaps);
  }

  addVarValuePossibleValues(
    name: string,
    value: string,
    constrainedVarName: string,
    possibleValues: string[]
  ) {
    this.map.get(name).get(value).set(constrainedVarName, possibleValues);
  }

  getVarValuePossibleValues(name: string, value: string) {
    return this.map.get(name).get(value);
  }
}

export function domainIntersection(
  domains1: Map<string, string[]>,
  domains2: Map<string, string[]>
): Map<string, string[]> {

  const resMap: Map<string,string[]> = new Map();

  for (const name of domains1.keys()) {
    const set1 = domains1.get(name);
    const set2 = domains2.get(name);
    resMap.set(name, [...set1].filter((x) => set2.includes(x)));
  }

  return resMap;
}

//TODO make it more tolerant for different formats of fact strings (spaces,...)
export function getConstraintSatValues(
  constrainingVar: { name: string; value: string },
  constrainedVar: { name: string; values: string[] },
  constraints: string[],
  truePredicates: PDDLFact[]
): boolean {
  let isConstrained = false;
  for (const con of constraints) {
    if (con.includes(constrainingVar.name) && con.includes(constrainedVar.name)) {
      isConstrained = true;

      let conRegexString = con.replace(
        constrainingVar.name,
        constrainingVar.value
      ).replace(/\s+/, "");

      conRegexString = conRegexString.replace("(", "\\(");
      conRegexString = conRegexString.replace(")", "\\)");
      conRegexString = conRegexString.replace(constrainedVar.name, "(\\w+)");
      for (const freeVar of getFreeVariables(conRegexString)) {
        conRegexString = conRegexString.replace(freeVar, "\\w+");
      }

      const conRegex = new RegExp(conRegexString);
      for (const pre of truePredicates) {
        const m = conRegex.exec(FactToString(pre).replace(/\s+/, ""));
        if (m) {
          constrainedVar.values.push(m[1]);
        }
      }
    }
  }
  return isConstrained;
}

function instanciateContraint(
  constraint: string,
  varValueMapping: Map<string, string>
): string {
  for (const pair of varValueMapping) {
    constraint = constraint.replace(pair[0], pair[1]);
  }
  return constraint;
}

function getArgs(constraint: string): string[] {
  constraint = constraint.replace("(", ",").replace(")", "");
  const [pred, ...argsString] = constraint.split(",");
  return argsString;
}

function getFreeVariables(constraint: string): string[] {
  return getArgs(constraint).filter((v) => v.startsWith("$"));
}
