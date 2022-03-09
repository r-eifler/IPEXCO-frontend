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
      return new Fact(this.name, this.parameters, this.negated);
    }

    instantiateFromArgs(args: string): Predicat {
      let init_params = []
      for (const arg of zip(this.parameters, args)){
        init_params.push({name: arg[2], type: arg[1].type})
      }
      return new Predicat(this.name, init_params);
    }

    instantiateFromArgsMap(args: Map<string,string>): Predicat {
      let init_params = []
      for (const arg of this.parameters){
        init_params.push({name: args.get(arg.name), type: arg.type})
      }
      return new Predicat(this.name, init_params);
    }

    toPDDL(withType = false): string {
        if (withType){
            return "(" + this.name + ' ' +
            this.parameters.map(p => p.name + " - " + p.type).join(' ') + ")"
        }
        return (this.negated ? "! " : "") + "(" + this.name + ' ' +
            this.parameters.map(p => p.name).join(' ') + ")"
    }
}

export class Fact {
    public name: string;
    public negated: boolean;
    public arguments: Object[];

    constructor(name: string, args: Object[], negated=false){
        this.name = name;
        this.arguments = args;
        this.negated = negated;
    }

    static fromJSON(json){
      return new Fact(json.name, json.arguments, json.negated);
    }

    toPDDL(): string {
        return (this.negated ? "! " : "") + "(" + this.name + ' ' +
            this.arguments.map(p => p.name).join(' ') + ")"
    }
}

export class Action {
    public name: string;
    public parameters: Object[];
    public precondition: Predicat[];
    public effects: Predicat[];

    constructor(name: string, parameters: Object[], precondition: Predicat[], effects: Predicat[]){
        this.name = name;
        this.parameters = parameters;
        this.precondition = precondition;
        this.effects = effects;
    }

    static fromJSON(json){
      return new Action(json.name, json.parameters,
        json.precondition.map(p => Predicat.fromJSON(p)),
        json.eff.map(e => Predicat.fromJSON(e)));
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
    public domain: string;
    public types: Type[];
    public objects: Object[];
    public predicats: Predicat[];
    public init: Fact[];
    public goals: Fact[];
    public actions: Action[];

    constructor(name: string, domain: string, types: Type[], objects: Object[],
        predicates: Predicat[], initial: Fact[], goal: Fact[], actions: Action[]){
        super();
        this.name = name;
        this.domain = domain;
        this.types = types;
        this.objects = objects;
        this.predicats = predicates;
        this.init = initial;
        this.goals = goal;
        this.actions = actions;
    }

    static fromJSON(json){
        let types = json.types;
        let objects = json.objects;
        let predicates = json.predicates;
        let actions = json.actions.map(p => Action.fromJSON(p))
        let initial = json.initial.map(p => Fact.fromJSON(p))
        let goal = json.goal.map(p => Fact.fromJSON(p));

        return new PlanningTask(json.name, json.domain, types, objects, predicates, initial, goal, actions)
    }

    toPDDLDomain(): string {

        let d = "(define (domain " + this.domain + ")\n";
        d += "(:requirements :typing :action-costs)\n";
        d += "(:types " + this.types.map(t => t.name + "-" + t.parent).join("\n") + "\n)\n";
        d += "(predicates: " + this.predicats.map(p => p.toPDDL(true)).join("\n") + "\n)\n";
        d += this.actions.map(a => a.toPDDL()).join("\n");
        d += "\n)";

        return d;
    }

    toPDDLProblem(): string {

      let p = "(define (problem " + this.name + ")\n";
      p += "(domain " + this.domain + ")";
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
