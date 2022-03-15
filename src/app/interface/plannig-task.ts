const zip = (a, b) => a.map((k, i) => [k, b[i]]);

export interface Type {
    name: string;
    parent: string;
}

export interface Object {
    name: string;
    type: string;
}

export class Predicat {
    public name: string;
    public negated: boolean;
    public parameters: Object[];

    constructor(name: string, parameters: Object[], negated=false){
        this.name = name;
        this.parameters = parameters;
        this.negated = negated;
    }

    static fromJSON(json){
      return new Predicat(json.name, json.parameters, json.negated);
    }

    toFact(): Fact {
      return new Fact(this.name, this.parameters.map(p => p.name), this.negated);
    }

    instantiateFromArgs(args: string): Predicat {
      let init_params = []
      for (const arg of zip(this.parameters, args)){
        init_params.push({name: arg[2], type: arg[1].type})
      }
      return new Predicat(this.name, init_params);
    }

    instantiateFromArgsMap(args: Map<string,string>): Predicat {
      return new Predicat(this.name, this.parameters.map(p => {return {name: args.get(p.name), type: p.type}}));
    }

    instantiateAll(typeObjectMap: Map<string,string[]>): Fact[] {
      let init_params: string[][] = [[]]
      for (const param of this.parameters){
        let paratial_args_list: string[][] = [...init_params];
        init_params = []
        for (const object of typeObjectMap.get(param.type))
          for(const partial_args of paratial_args_list){
            let copy = [...partial_args];
            copy.push(object);
            init_params.push(copy);
          }
      }
      return init_params.map(ps => new Fact(this.name, ps));
    }

    toPDDL(withType = false): string {
        if (withType){
            return "(" + this.name + ' ' +
            this.parameters.map(p => p.name + " - " + p.type).join(' ') + ")"
        }
        return (this.negated ? "! " : "") + "(" + this.name + ' ' +
            this.parameters.map(p => p.name).join(' ') + ")"
    }

    toString(): string {
      return this.name + "(" + this.parameters.map(p => p.name + ": " + p.type).join(', ') + ")";
    }
}

export class Fact {
    public name: string;
    public negated: boolean;
    public arguments: string[];

    constructor(name: string, args: string[], negated=false){
        this.name = name;
        this.arguments = args;
        this.negated = negated;
    }

    instantiateFromArgsMap(args: Map<string,string>): Fact {
      let init_args = []
      for (const arg of this.arguments){
        init_args.push(args.get(arg))
      }
      return new Fact(this.name, init_args, this.negated);
    }

    static fromJSON(json){
      return new Fact(json.name, json.arguments, json.negated);
    }

    toPDDL(): string {
        return (this.negated ? "! " : "") + "(" + this.name + ' ' +
            this.arguments.join(' ') + ")"
    }

    toString(): string {
      if (this.negated) {
        return "! " + this.name + "(" + this.arguments.join(', ') + ")";
      }
      return this.name + "(" + this.arguments.join(', ') + ")";
    }


}

export class Action {
    public name: string;
    public parameters: Object[];
    public precondition: Fact[];
    public effects: Fact[];

    constructor(name: string, parameters: Object[], precondition: Fact[], effects: Fact[]){
        this.name = name;
        this.parameters = parameters;
        this.precondition = precondition;
        this.effects = effects;
    }

    static fromJSON(json){
      return new Action(json.name, json.parameters,
        json.precondition.map(p => Fact.fromJSON(p)),
        json.effects.map(e => Fact.fromJSON(e)));
    }

    instantiate(args: string[]): Action {
        let args_map = new Map<string,string>()
        for (let i = 0; i < args.length; i++) {
          args_map.set(this.parameters[i].name,args[i])
        }

        let i_params: Object[] = this.parameters.map(o => {return {name: args_map.get(o.name), type: o.type}})

        let i_precon = []
        for (const pre of this.precondition){
            i_precon.push(pre.instantiateFromArgsMap(args_map))
        }

        let i_eff = []
        for (const eff of this.effects){
          i_eff.push(eff.instantiateFromArgsMap(args_map))
        }
        return new Action(this.name, i_params, i_precon, i_eff)
    }

    toPDDL(): string {
        let s = "(:action " + this.name + "\n";
        s += "\tparameters: " + this.parameters.map(p => "(" + p.name + ")").join(' ') + "\n";
        s += "\tprecondition: (and " + this.precondition.map(p => p.toPDDL()).join(' ') + ")\n";
        s += "\teffect: (and " + this.effects.map(p => p.toPDDL()).join(' ') + ")\n";
        return s + ")\n";
    }
}


export class PlanningTask extends Document {
    public name: string;
    public types: Type[];
    public domain_name: string;
    public objects: Object[];
    public predicates: Predicat[];
    public init: Fact[];
    public goals: Fact[];
    public actions: Action[];

    constructor(name: string, domain_name: string, types: Type[], objects: Object[],
        predicates: Predicat[], initial: Fact[], goal: Fact[], actions: Action[]){
        super();
        this.name = name;
        this.domain_name = domain_name;
        this.types = types;
        this.objects = objects;
        this.predicates = predicates;
        this.init = initial;
        this.goals = goal;
        this.actions = actions;
    }

  static fromJSON(json, name, domain_name){
    console.log(json);
    let types = json.types;
    let objects = json.objects;
    let predicates = json.predicates.map(p => Predicat.fromJSON(p));
    let actions = json.actions.map(p => Action.fromJSON(p))
    let initial = json.initial.map(p => Fact.fromJSON(p))
    let goal = json.goal.map(p => Fact.fromJSON(p));

    return new PlanningTask(name, domain_name, types, objects, predicates, initial, goal, actions)
  }

  getObjectTypeMap(): Map<string, string[]> {
    // TODO consider type hirarchy
    let otmap = new Map<string, string[]>();
    otmap.set('object', this.objects.map(o => o.name));
    for (const o of this.objects) {
      if (! otmap.has(o.type)) {
        otmap.set(o.type, []);
      }
      otmap.get(o.type).push(o.name);
    }
    return otmap;
  }

  toPDDLDomain(): string {

      let d = "(define (domain " + this.domain_name.replace(/\s+/g, '') + ")\n";
      d += "(:requirements :typing :action-costs)\n";
      d += "(:types " + this.types.map(t => t.name + "-" + t.parent).join("\n") + "\n)\n";
      d += "(predicates: " + this.predicates.map(p => p.toPDDL(true)).join("\n") + "\n)\n";
      d += this.actions.map(a => a.toPDDL()).join("\n");
      d += "\n)";

      return d;
  }

  toPDDLProblem(): string {

    let p = "(define (problem " + this.name.replace(/\s+/g, '') + ")\n";
    p += "(domain " + this.domain_name.replace(/\s+/g, '') + ")";
    p += "(:objects " + this.objects.map(o => o.name + "-" + o.type).join("\n") + "\n)\n";
    p += "(:init\n " + this.init.map(f => f.toPDDL()).join("\n") + "\n)\n";
    p += "(goal: (and " + this.goals.map(p => p.toPDDL()).join("\n") + ")\n";
    p += "\n)";

    return p;
  }

  taskSchema(): string {
    return JSON.stringify(this);
  }
}
