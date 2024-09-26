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
  negated: boolean;
  arguments: string[];
}

export interface PDDLAction {
  name: string;
  parameters: PDDLObject[];
  precondition: PDDLFact[];
  effects: PDDLFact[];
}

export interface PlanningDomain {
  types: {name: string, parent: string}[]
  predicates: PDDLPredicate[]
  actions: PDDLAction[],
}

export interface PlanningProblem {
  objects: {name: string, type: string}[],
  initial: PDDLFact[]
  goal: PDDLFact[]
}

export interface PlanningModel extends PlanningDomain, PlanningProblem {}

export interface PlanningTask {
  _id?: string;
  name: string;
  domain_name: string;
  encoding: string;
  model: PlanningModel;
}


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
  // if(!fact.name || !fact.arguments) {
  //   console.log(fact);
  //   return "error";
  // }
  if (fact.negated) {
    return "! " + fact.name + "(" + fact.arguments.join(", ") + ")";
  }
  return fact.name + "(" + fact.arguments.join(", ") + ")";
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
  for (const eff of action.effects) {
    i_eff.push(instantiateFactFromArgsMap(eff, args_map));
  }
  return {
    name: action.name,
    parameters: i_params,
    precondition: i_precon,
    effects: i_eff,
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
    action.effects.map((p) => factToPDDL(p)).join(" ") +
    ")\n";
  return s + ")\n";
}


export function getObjectTypeMap(task: PlanningTask): Map<string, string[]> {
  // TODO consider type hirarchy
  let otmap = new Map<string, string[]>();
  otmap.set(
    "object",
    task.model.objects.map((o) => o.name)
  );
  for (const o of task.model.objects) {
    if (!otmap.has(o.type)) {
      otmap.set(o.type, []);
    }
    otmap.get(o.type).push(o.name);
  }
  return otmap;
}

export function toPDDLDomain(task: PlanningTask): string {
  let d = "(define (domain " + task.domain_name.replace(/\s+/g, "") + ")\n";
  d += "(:requirements :typing :action-costs)\n";
  d +=
    "(:types " +
    task.model.types.map((t) => t.name + "-" + t.parent).join("\n") +
    "\n)\n";
  d +=
    "(predicates: " +
    task.model.predicates.map((p) => predicateToPDDL(p, true)).join("\n") +
    "\n)\n";
  d += task.model.actions.map((a) => actionToPDDL(a)).join("\n");
  d += "\n)";

  return d;
}

export function toPDDLProblem(task: PlanningTask): string {
  let p = "(define (problem " + task.name.replace(/\s+/g, "") + ")\n";
  p += "(domain " + task.domain_name.replace(/\s+/g, "") + ")";
  p +=
    "(:objects " +
    task.model.objects.map((o) => o.name + "-" + o.type).join("\n") +
    "\n)\n";
  p +=
    "(:init\n " + task.model.initial.map((f) => factToPDDL(f)).join("\n") + "\n)\n";
  p += "(goal: (and " + task.model.goal.map((p) => factToPDDL(p)).join("\n") + ")\n";
  p += "\n)";

  return p;
}

export function getTaskSchema(task: PlanningTask): string {
  return JSON.stringify(task);
}
