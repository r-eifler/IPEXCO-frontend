import { Action, Fact } from "./plannig-task";

export interface Plan {
  actions: Action[];
  cost: number;
}

export class State {

  values: Fact[]

  constructor(values){
    this.values = values;
  }

  nextState(action: Action): State {
    // console.log(action.name);
    // console.log(this.values);
    let new_values = [...this.values];
    for (const eff of action.effects){
      if (eff.negated){
        const index = new_values.indexOf(eff);
        new_values.splice(index, 1);
        // console.log("delete: " + eff)
      }
      else {
        new_values.push(eff)
        // console.log("add: " + eff)
      }
    }
    new_values.sort();
    // console.log(new_values);
    return new State(new_values);
  }
}
