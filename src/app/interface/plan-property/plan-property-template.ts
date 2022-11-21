import { Fact, FactToString, PlanningTask } from "src/app/interface/plannig-task";
import { Action, ActionSet, GoalType, toAction } from "./plan-property";
import { PlanProperty } from "src/app/interface/plan-property/plan-property";
import { Project } from "../project";
import { TaskSchema } from "../task-schema";

export class PlanPropertyTemplate {
  public class: string;
  public type: GoalType;
  public variables: {
    name: string;
    type: string | string[];
  }[];
  public nameTemplate: string;
  public formulaTemplate: string;
  public actionSetsTemplates: ActionSetsTemplates[];
  public sentenceTemplate: string;
  public initVariableConstraints: string[];
  public goalVariableConstraints: string[];
  private constraintDomains: ConstraintDomains = new ConstraintDomains();
  public numSelectableVariables = 0;

  getSentenceTemplateParts(): string[] {
    let numSelectableVariables = 0;
    const parts: string[] = [""];
    for (const word of this.sentenceTemplate.split(" ")) {
      if (word.startsWith("$")) {
        parts.push(word);
        parts.push("");
        numSelectableVariables++;
      } else {
        parts[parts.length - 1] = parts[parts.length - 1] + " " + word;
      }
    }
    // console.log(parts);
    this.numSelectableVariables = numSelectableVariables;
    return parts;
  }

  initializeVariableConstraints(task: PlanningTask) {
    const varValues = this.getPossibleTypeVariableDomains(task);
    for (const entry1 of varValues.entries()) {
      this.constraintDomains.addNewVar(entry1[0], entry1[1]);
      for (const v of entry1[1]) {
        for (const entry2 of varValues.entries()) {
          if (entry2[0] !== entry1[0]) {
            const constrainigVar = { name: entry1[0], value: v };
            const constrainedVar = {
              name: entry2[0],
              values: new Set<string>(),
            };
            const constrained = getConstraintSatValues(
              constrainigVar,
              constrainedVar,
              this.initVariableConstraints,
              task.initial
            );
            if (constrained) {
              this.constraintDomains.addVarValuePosibleValues(
                constrainigVar.name,
                constrainigVar.value,
                constrainedVar.name,
                constrainedVar.values
              );
            } else {
              this.constraintDomains.addVarValuePosibleValues(
                constrainigVar.name,
                constrainigVar.value,
                constrainedVar.name,
                varValues.get(constrainedVar.name)
              );
            }
          } else {
            this.constraintDomains.addVarValuePosibleValues(
              entry1[0],
              v,
              entry1[0],
              varValues.get(entry1[0])
            );
          }
        }
      }
    }
  }

  generatePlanProperty(
    varValueMapping: Map<string, string>,
    task: PlanningTask,
    project: Project
  ): PlanProperty {
    this.completeVarValueMapping(varValueMapping, task);

    let name = this.nameTemplate;
    let formula = this.formulaTemplate;
    let naturalLanguageDescription = this.sentenceTemplate;

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
    for (const actionSetT of this.actionSetsTemplates) {
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
      type: this.type,
      formula,
      actionSets,
      naturalLanguageDescription,
      project: project._id,
      isUsed: false,
      globalHardGoal: false,
      value: 1,
      color: "#696969",
      icon: "star",
      class: this.class
    };
  }

  completeVarValueMapping(
    varValueMapping: Map<string, string>,
    task: PlanningTask
  ) {
    for (const variable of this.variables) {
      if (!varValueMapping.has(variable.name)) {
        varValueMapping.set(
          variable.name,
          this.findVarValue(variable.name, varValueMapping, task)
        );
      }
    }
  }

  findVarValue(
    varName: string,
    varValueMapping: Map<string, string>,
    task: PlanningTask
  ): string {
    for (const constraint of this.goalVariableConstraints) {
      if (constraint.includes(varName)) {
        let constraintInstance = constraint.replace("(", "\\(");
        constraintInstance = constraintInstance.replace(")", "\\)");
        constraintInstance = constraintInstance.replace(varName, "(\\w+)");
        for (const pair of varValueMapping.entries()) {
          constraintInstance = constraintInstance.replace(pair[0], pair[1]);
        }
        const regex = RegExp(constraintInstance);
        for (const goal of task.goal) {
          const match = regex.exec(goal.name);
          if (match) {
            return match[1];
          }
        }
      }
    }
    throw Error("Variable " + varName + " has no value.");
  }

  getPossibleTypeVariableDomains(task: PlanningTask): Map<string, Set<string>> {
    // get all values which have the right type
    const map = new Map<string, Set<string>>();
    for (const variable of this.variables) {
      const matchingObjects: Set<string> = new Set();
      for (const obj of task.objects) {
        if (variable.type.length === 1 && obj.type === variable.type) {
          matchingObjects.add(obj.name);
        }
        if (variable.type.length > 1 && variable.type.includes(obj.type)) {
          matchingObjects.add(obj.name);
        }
      }
      map.set(variable.name, matchingObjects);
    }
    return map;
  }

  getPossibleVariableValues(
    task: PlanningTask,
    varValueMapping: Map<string, string>
  ): Map<string, Set<string>> {
    let resMap: Map<string, Set<string>> = this.getPossibleTypeVariableDomains(task);
    for (const variable of varValueMapping.keys()) {
      resMap = domainIntersection(
        resMap,
        this.constraintDomains.getVarValuePosibleValues(variable, varValueMapping.get(variable))
      );
    }
    return resMap;
  }
}

export interface ActionSetsTemplates {
  name: string;
  actionTemplates: string[];
}

export class ConstraintDomains {
  private map: Map<string, Map<string, Map<string, Set<string>>>> = new Map();

  addNewVar(name: string, values: Set<string>) {
    const valueMaps: Map<string, Map<string, Set<string>>> = new Map();
    for (const v of values) {
      valueMaps.set(v, new Map());
    }
    this.map.set(name, valueMaps);
  }

  addVarValuePosibleValues(
    name: string,
    value: string,
    constrainedVarName: string,
    possibleValues: Set<string>
  ) {
    this.map.get(name).get(value).set(constrainedVarName, possibleValues);
  }

  getVarValuePosibleValues(name: string, value: string) {
    return this.map.get(name).get(value);
  }
}

export function domainIntersection(
  domains1: Map<string, Set<string>>,
  domains2: Map<string, Set<string>>
): Map<string, Set<string>> {
  const resMap: Map<string, Set<string>> = new Map();
  for (const name of domains1.keys()) {
    const set1 = domains1.get(name);
    const set2 = domains2.get(name);
    resMap.set(name, new Set([...set1].filter((x) => set2.has(x))));
  }
  return resMap;
}

//TODO make it more trolerat for different formats of fact srtings (spaces,...)
export function getConstraintSatValues(
  constrainingVar: { name: string; value: string },
  constrainedVar: { name: string; values: Set<string> },
  constraints: string[],
  truePredicates: Fact[]
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
          constrainedVar.values.add(m[1]);
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
