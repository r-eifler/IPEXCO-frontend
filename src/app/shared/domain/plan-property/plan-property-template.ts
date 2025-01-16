import { PDDLFact, FactToString, PlanningTask, PDDLObject } from "src/app/shared/domain/planning-task";
import { Action, ActionSet, GoalType, PlanProperty, toAction } from "src/app/shared/domain/plan-property/plan-property";

export interface PlanPropertyTemplate {
  class: string;
  color: string,
  icon: string,
  type: GoalType;
  variables: Record<string,string[]>;
  nameTemplate: string;
  formulaTemplate: string;
  actionSetsTemplates: ActionSetsTemplates[];
  sentenceTemplate: string;
  initVariableConstraints: string[];
  goalVariableConstraints: string[];
}

export const defaultPlanPropertyTemplate = {
  class: 'None',
  color: '#e0e0e0',
  icon: 'star',
  type: GoalType.goalFact,
  variables: {},
  nameTemplate: 'new template',
  formulaTemplate: '',
  actionSetsTemplates: [],
  sentenceTemplate: '',
  initVariableConstraints: [],
  goalVariableConstraints:[],
}

export interface TemplatePart {
	isVar: boolean,
	isSelected: boolean,
	var: string | undefined,
	text: string, 
	possibleValues: PDDLObject[]
}

export function getTemplateParts(template: PlanPropertyTemplate): TemplatePart[]{

    const parts: TemplatePart[] = [];

    for (const word of template.sentenceTemplate.split(" ")) {
      if (word.startsWith("$")) {
        parts.push({
          isVar: true,
          isSelected: false,
          var: word,
          text: word, 
          possibleValues:[]
        })
      } else {
        if(parts.length == 0 || parts[parts.length - 1].isVar){
          parts.push({
            isVar: false,
            isSelected: false,
            var: undefined,
            text: word, 
            possibleValues:[]
          })
        }
        else {
          parts[parts.length - 1].text += " " + word
        }
      }
    }
    
    return parts
  }

export function generatePlanProperty(
    template: PlanPropertyTemplate,
    varObjectMapping: Record<string, PDDLObject>,
  ): PlanProperty {

    let name = template.nameTemplate;
    let formula = template.formulaTemplate;
    let naturalLanguageDescription = template.sentenceTemplate;

    for (const variable of Object.keys(varObjectMapping)) {
      const object = varObjectMapping[variable];
      const regex = new RegExp(variable.replace("$", "\\$"), "g");
      formula = formula.replace(regex, object.name);
      name = name.replace(regex, object.name);
      naturalLanguageDescription = naturalLanguageDescription.replace(
        regex,
        object.name
      );
    }

    const actionSets: ActionSet[] = [];
    for (const actionSetT of template.actionSetsTemplates) {
      const actions: Action[] = [];
      for (let actionT of actionSetT.actionTemplates) {
        for (const variable of Object.keys(varObjectMapping)) {
          const object = varObjectMapping[variable];
          actionT = actionT.replace(variable, object.name);
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
      project: null,
      isUsed: false,
      globalHardGoal: false,
      utility: 1,
      color: template.color,
      icon: template.icon,
      class: template.class
    };
  }


  export function generateDummyPlanProperty(
    template: PlanPropertyTemplate,
    varObjectMapping: Record<string, PDDLObject>
  ): PlanProperty {

    let name = template.nameTemplate;
    let formula = template.formulaTemplate;
    let naturalLanguageDescription = template.sentenceTemplate;

    for (const variable of Object.keys(varObjectMapping)) {
      const object = varObjectMapping[variable];
      const regex = new RegExp(variable.replace("$", "\\$"), "g");
      formula = formula.replace(regex, object.name);
      name = name.replace(regex, object.name);
      naturalLanguageDescription = naturalLanguageDescription.replace(
        regex,
        object.name
      );
    }

    const actionSets: ActionSet[] = [];
    for (const actionSetT of template.actionSetsTemplates) {
      const actions: Action[] = [];
      for (let actionT of actionSetT.actionTemplates) {
        for (const variable of Object.keys(varObjectMapping)) {
          const object = varObjectMapping[variable];
          actionT = actionT.replace(variable, object.name);
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
      project: null,
      isUsed: false,
      globalHardGoal: false,
      utility: 1,
      color: template.color,
      icon: template.icon,
      class: template.class
    };
  }

  export function getPossibleObjectsBasedOnType(
    types: string[],
    task: PlanningTask
  ): PDDLObject[] {
    return task.model.objects.filter(o => types.includes(o.type))
  }

  export function getPossibleValues(
    template: PlanPropertyTemplate,
    task: PlanningTask,
    selectedValues: Record<string, PDDLObject>): Record<string, PDDLObject[]> {

    const variables = Object.keys(template.variables)
    // console.log(variables)
    // console.log(template.variables[variables[0]])
    let possibleObjects: Record<string, PDDLObject[]> = {}
    variables.forEach(v => possibleObjects[v] = getPossibleObjectsBasedOnType(template.variables[v], task));

    // for already selected variables possible values is []
    variables.forEach(v => selectedValues[v] ? possibleObjects[v] = [selectedValues[v]] : possibleObjects[v] = possibleObjects[v])

    //remove all already selected options
    variables.forEach( v => possibleObjects[v] = possibleObjects[v].filter(
      o => ! Object.values(selectedValues).map(so => so.name).includes(o.name)
    ))

    //check assignment based on init and goal constraints
    for(let constraint of template.initVariableConstraints){
        const constraintPossibleValues = 
          getObjectsSatisfyingConstraint(variables,selectedValues, constraint, task.model.initial);
        
        variables.forEach( v => possibleObjects[v] = possibleObjects[v].filter(
          o => constraintPossibleValues[v].includes(o.name)
        ))
    }

    return possibleObjects;
  }

function getObjectsSatisfyingConstraint(
  variables: string[],
  selectedObjects: Record<string,PDDLObject>,
  constraint: string,
  knowledgeBase: PDDLFact[]
): Record<string,string[]> {

  let collection: Record<string,Set<string>> = {}

  for(const v of variables){
    if(selectedObjects[v]){
      collection[v] = new Set([selectedObjects[v].name]);
    }
    else{
      collection[v] = new Set()
    }
  }

  const selectedVariables = variables.filter(v => selectedObjects[v] && constraint.includes(v))
  const freeVariables = variables.filter(v => ! selectedObjects[v] && constraint.includes(v))

  let conRegexString  = constraint.replace(/\\s+/g, "").replace('\)', '\\)').replace('\(', '\\(') 

  // already selected variables
  conRegexString = selectedVariables.reduce(
    (conRegexString, v) => conRegexString.replace(v, selectedObjects[v].name),
    conRegexString
  )
  
  // still free variables
  conRegexString = freeVariables.reduce(
    (conRegexString, free) => conRegexString.replace(free, "(?<" + free + ">\[\\w\-_\]+)"),
    conRegexString
  )

  // wildcards *
  conRegexString = conRegexString.replace('\*', '\[\\w\-_\]+')

  const conRegex = new RegExp(conRegexString);
  for (const pre of knowledgeBase) {
    const m = conRegex.exec(FactToString(pre).replace(/\\s+/g, ""));
    if (m) {
      freeVariables.map(v => collection[v].add(m.groups[v]))
    }
  }

  let res = {}
  Object.keys(collection).forEach(k => res[k] = [...collection[k]]);
  return res

}

export interface ActionSetsTemplates {
  name: string;
  actionTemplates: string[];
}

