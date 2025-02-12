import { BaseModel } from "./planning-task";

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

export interface PDDLType {
    name: string;
    parent: string;
  }
  
export interface PDDLObject {
    name: string;
    type: string;
}
  
export interface PDDLPredicate {
    name: string;
    negated: boolean;
    parameters: PDDLObject[];
}

export interface PDDLFact {
    name: string;
    arguments: string[]; 
    negated: boolean;
}

export interface PDDLFunctionAssignment {
    name: string;
    arguments: string[]; 
    value: number;
}

export interface PDDLAction {
    name: string; 
    parameters:  PDDLObject[];
    precondition: PDDLFact[];
    effect: PDDLFact[];
}

export interface PDDLPlanningDomain {
    constants: {
        name: string; 
        type: string | undefined;
    }[];
    types: PDDLType[];
    predicates: PDDLPredicate[];
    actions: PDDLAction[];
}

export interface PDDLPlanningProblem extends BaseModel{
    objects: PDDLObject[];
    initial: PDDLFact[];
    goal: PDDLFact[];
}

export interface PDDLPlanningModel extends PDDLPlanningDomain, PDDLPlanningProblem {}

export function predicateToFact(pred: PDDLPredicate): PDDLFact {
    return {
      name: pred.name,
      arguments: pred.parameters.map((p) => p.name),
      negated: pred.negated,
    };
  }
  
  export function instantiatePredicateFromArgs(
    pred: PDDLPredicate,
    args: string
  ): PDDLPredicate {
    let init_params = [];
    for (const arg of zip(pred.parameters, args)) {
      init_params.push({ name: arg[2], type: arg[1].type });
    }
    return { name: pred.name, parameters: init_params, negated: pred.negated };
  }
  
  export function instantiatePredicateFromArgsMap(
    pred: PDDLPredicate,
    args: Map<string, string>
  ): PDDLPredicate {
    return {
      name: pred.name,
      parameters: pred.parameters.map((p) => {
        return { name: args.get(p.name), type: p.type };
      }),
      negated: pred.negated,
    };
  }
  
  export function instantiatePredicateAll(
    pred: PDDLPredicate,
    typeObjectMap: Map<string, string[]>
  ): PDDLFact[] {
    let init_params: string[][] = [[]];
    for (const param of pred.parameters) {
      let partial_args_list: string[][] = [...init_params];
      init_params = [];
      for (const object of typeObjectMap.get(param.type))
        for (const partial_args of partial_args_list) {
          let copy = [...partial_args];
          copy.push(object);
          init_params.push(copy);
        }
    }
    return init_params.map((ps) => ({
      name: pred.name,
      arguments: ps,
      negated: pred.negated,
    }));
  }
  
  export function predicateToPDDL(pred: PDDLPredicate, withType = false): string {
    if (withType) {
      return (
        "(" +
        pred.name +
        " " +
        pred.parameters.map((p) => p.name + " - " + p.type).join(" ") +
        ")"
      );
    }
    return (
      (pred.negated ? "! " : "") +
      "(" +
      pred.name +
      " " +
      pred.parameters.map((p) => p.name).join(" ") +
      ")"
    );
  }
  
  export function predicateToString(pred: PDDLPredicate): string {
    return (
      pred.name +
      "(" +
      pred.parameters.map((p) => p.name + ": " + p.type).join(", ") +
      ")"
    );
  }
  
  
  
  export function factEquals(f1: PDDLFact, f2: PDDLFact): boolean {
    return (
      f1.name == f2.name &&
      JSON.stringify(f1.arguments) === JSON.stringify(f2.arguments)
    );
  }
  
  export function instantiateFactFromArgsMap(
    fact: PDDLFact,
    args: Map<string, string>
  ): PDDLFact {
    let init_args = [];
    for (const arg of fact.arguments) {
      init_args.push(args.get(arg));
    }
    return { name: fact.name, arguments: init_args, negated: fact.negated };
  }
  
  export function factToPDDL(fact: PDDLFact): string {
    return (
      (fact.negated ? "! " : "") +
      "(" +
      fact.name +
      " " +
      fact.arguments.join(" ") +
      ")"
    );
  }
  
  export function FactToString(fact: PDDLFact): string {
    if (fact.negated) {
      return "! " + fact.name + "(" + fact.arguments.map(f => f).join(",") + ")";
    }
    return fact.name + "(" + fact.arguments.join(",") + ")";
  }
  
  
  
  export function instantiateAction(action: PDDLAction, args: string[]): PDDLAction {
    let args_map = new Map<string, string>();
    for (let i = 0; i < args.length; i++) {
      args_map.set(action.parameters[i].name, args[i]);
    }
  
    let i_params: PDDLObject[] = action.parameters.map((o) => {
      return { name: args_map.get(o.name), type: o.type };
    });
  
    let i_precon = [];
    for (const pre of action.precondition) {
      i_precon.push(instantiateFactFromArgsMap(pre, args_map));
    }
  
    let i_eff = [];
    for (const eff of action.effect) {
      i_eff.push(instantiateFactFromArgsMap(eff, args_map));
    }
    return {
      name: action.name,
      parameters: i_params,
      precondition: i_precon,
      effect: i_eff,
    };
  }
  
  export function actionToPDDL(action: PDDLAction): string {
    let s = "(:action " + action.name + "\n";
    s +=
      "\tparameters: " +
      action.parameters.map((p) => "(" + p.name + ")").join(" ") +
      "\n";
    s +=
      "\tprecondition: (and " +
      action.precondition.map((p) => factToPDDL(p)).join(" ") +
      ")\n";
    s +=
      "\teffect: (and " +
      action.effect.map((p) => factToPDDL(p)).join(" ") +
      ")\n";
    return s + ")\n";
  }
  
  
  export function getObjectTypeMap(model: PDDLPlanningModel): Map<string, string[]> {
    // TODO consider type hirarchy
    let otmap = new Map<string, string[]>();
    otmap.set(
      "object",
      model.objects.map((o) => o.name)
    );
    for (const o of model.objects) {
      if (!otmap.has(o.type)) {
        otmap.set(o.type, []);
      }
      otmap.get(o.type).push(o.name);
    }
    return otmap;
  }


export function toPDDL(model: PDDLPlanningModel, with_goals=true): string[] {

    // domain
    let d = "(define (domain domainname)\n";
    d += "(:requirements :typing :action-costs)\n";

    d += "(:types\n" + 
        model.types
            .filter(t => t.name != 'object')
            .map(t => "\t\t" + t.name + " - " + (t.parent && t.parent != 'TODO' ? t.parent : 'object'))
            .join("\n") 
        + "\n)\n";

    if(!!model.constants && model.constants.length > 0){
        d += "(:constants \n" + model.constants.map(o => '\t' + o.name + " - " + o.type).join("\n") + "\n)\n";
    }

    d += "(:predicates \n" + model.predicates.map(
            pred => "\t(" + pred.name + ' ' + 
            pred.parameters.map(param => param.name + ' - ' + param.type).join(" ") + ")"
        ).join("\n") 
        + "\n)\n";

    d += model.actions
        .map(
            a => "(:action " + a.name + "\n\t:parameters (" + 
                a.parameters.map(p => p.name + ' - ' + p.type).join(" ") + ")\n" +
                "\t:precondition (and \n" +
                    a.precondition.map(p => 
                        p.negated ? 
                        "\t\t" + "(not (" + p.name + ' ' + p.arguments.join(" ") + "))" :
                        "\t\t" + "(" + p.name + ' ' + p.arguments.join(" ") + ")"
                    ).join('\n') +
                "\t)\n" +
                "\t:effect (and \n" +
                    a.effect.map(p => 
                        p.negated ? "\t\t" + "(not (" + p.name + ' ' + p.arguments.join(" ") + "))" :
                        "\t\t" + "(" + p.name + ' ' + p.arguments.join(" ") + ")"
                    ).join('\n') +
                "\t)\n)")
        .join("\n");

    d += "\n)";



    // problem
    let p = "(define (problem problemname)\n";
    p += "(:domain domainname)\n";

    p += "(:objects \n" + model.objects.map(o => '\t' + o.name + " - " + o.type).join("\n") + "\n)\n";

    p += "(:init\n " + model.initial.map(
        f => "\t(" + f.name + ' ' + f.arguments.join(" ") + ")").join("\n") 
        + "\n)\n";

    if(with_goals){
        p += "(:goal (and \n" + 
            model.goal.map(p => "\t(" + p.name + ' ' + p.arguments.join(" ") + ")").join("\n") 
            + "))\n";
    }
    else {
        p += "(:goal (and ))\n";
    }
    p += ")";

        return [d,p];
}   



