import { Action, ActionSet, GoalType, PlanProperty, PlanPropertyBase, PlanPropertyDefinition, toAction } from "src/app/shared/domain/plan-property/plan-property";
import { FactToString, PDDLFact, PDDLPlanningModel } from "../PDDL_task";
import { PlanningTask, TaskObject } from "../planning-task";

export interface PlanPropertyTemplate {
  class: string;
  color: string,
  icon: string,
  type: GoalType;
  variables: Record<string,string[]>;
  nameTemplate: string;
  definitionTemplate: PlanPropertyDefinition;
  formulaTemplate?: string;
  actionSetsTemplates?: ActionSetsTemplates[];
  sentenceTemplate: string;
  initVariableConstraints?: string[];
  goalVariableConstraints?: string[];
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
	possibleValues: TaskObject[],
  numeric: boolean
}

function isNumericVar(template: PlanPropertyTemplate, varName: string) {
  const types  = template.variables[varName];
  return types.length ==  1 && types[0] == 'number';
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
          possibleValues:[],
          numeric: isNumericVar(template,word)
        })
      } else {
        if(parts.length == 0 || parts[parts.length - 1].isVar){
          parts.push({
            isVar: false,
            isSelected: false,
            var: undefined,
            text: word, 
            possibleValues:[],
            numeric: false
          })
        }
        else {
          parts[parts.length - 1].text += " " + word
        }
      }
    }
    
    return parts
  }

export function generatePlanProperty (
    template: PlanPropertyTemplate,
    varObjectMapping: Record<string, TaskObject>,
    varNumericValueMapping: Record<string, number>,
  ): PlanPropertyBase {

    let fullMapping: Record<string, string> = {}
    for (const variable of Object.keys(varObjectMapping)) {
      fullMapping[variable] = varObjectMapping[variable].name
    }
    for (const variable of Object.keys(varNumericValueMapping)) {
      fullMapping[variable] = varNumericValueMapping[variable].toString();
    }

    let name = template.nameTemplate;
    let formula = template.formulaTemplate;
    let naturalLanguageDescription = template.sentenceTemplate;

    for (const variable of Object.keys(fullMapping)) {
      const value = fullMapping[variable];
      const regex = new RegExp(variable.replace("$", "\\$"), "g");
      if(formula)
        formula = formula.replace(regex, value);
      name = name.replace(regex, value);
      naturalLanguageDescription = naturalLanguageDescription.replace(
        regex,
        value
      );
    }

    let definition = {
      name: template.definitionTemplate.name,
      parameters: template.definitionTemplate.parameters.map(p =>
         varObjectMapping[p] ? varObjectMapping[p].name : varNumericValueMapping[p].toString()
      )
    }

    let actionSets: ActionSet[] | undefined = undefined;
    if(template.actionSetsTemplates){
      actionSets = [];
      for (const actionSetT of template.actionSetsTemplates) {
        const actions: Action[] = [];
        for (let actionT of actionSetT.actionTemplates) {
          for (const variable of Object.keys(fullMapping)) {
            const value = fullMapping[variable];
            actionT = actionT.replace(variable, value);
          }
          actions.push(toAction(actionT));
        }
        actionSets.push({ name: actionSetT.name, actions });
      }
    }

    return {
      name,
      type: template.type,
      definition,
      formula: formula ?? null,
      actionSets,
      naturalLanguageDescription,
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
  ): TaskObject[] {
    return task.model.objects.filter(o => types.includes(o.type))
  }

  export function getPossibleValues(
    template: PlanPropertyTemplate,
    task: PlanningTask,
    selectedValues: Record<string, TaskObject>): Record<string, TaskObject[]> {

    const variables = Object.keys(template.variables)
    // console.log(variables)
    // console.log(template.variables[variables[0]])
    let possibleObjects: Record<string, TaskObject[]> = {}
    variables.filter(v => !isNumericVar(template,v)).
    forEach(v => possibleObjects[v] = getPossibleObjectsBasedOnType(template.variables[v], task));

    // for already selected variables possible values is [selectedValue]
    variables.filter(v => !!selectedValues[v]).forEach(v => possibleObjects[v] = [selectedValues[v]]);

    //remove all already selected options
    variables.filter(v => !!possibleObjects[v]).forEach( v => possibleObjects[v] = possibleObjects[v].filter(
      o => ! Object.values(selectedValues).map(so => so.name).includes(o.name)
    ))

    //check assignment based on init and goal constraints
    if(template.initVariableConstraints){
      for(let constraint of template.initVariableConstraints){
          const constraintPossibleValues = 
            getObjectsSatisfyingConstraint(
              variables,selectedValues, 
              constraint, 
              (task.model as PDDLPlanningModel).initial ? (task.model as PDDLPlanningModel).initial : []
            );
          
          variables.forEach( v => possibleObjects[v] = possibleObjects[v].filter(
            o => constraintPossibleValues[v].includes(o.name)
          ))
      }
    }

    return possibleObjects;
  }

function getObjectsSatisfyingConstraint(
  variables: string[],
  selectedObjects: Record<string,TaskObject>,
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
      freeVariables.forEach(v => {
        if (m.groups !== undefined){
          const value = m.groups[v]
          if(value)
            collection[v].add(value)
        }
    })
    }
  }

  let res: Record<string, string[]> = {}
  Object.keys(collection).forEach(k => res[k] = [...collection[k]]);
  return res

}

export interface ActionSetsTemplates {
  name: string;
  actionTemplates: string[];
}

