import { Action, Fact, factEquals } from "./plannig-task";

export interface Plan {
  actions: Action[];
  cost: number;
}

export interface State {
  values: Fact[]
}

export function nextState(state: State, action: Action): State {
  // console.log(action.name);
  let new_values = [...state.values];
  for (const eff of action.effects){
    if (eff.negated){
      const index = new_values.findIndex(e => factEquals(e,eff));
      // console.log(index);
      new_values.splice(index, 1);
      // console.log("delete: " + eff)
    }
    else {
      new_values.push(eff)
      // console.log("add: " + eff)
    }
    // console.log(new_values.map(v => v.toString()));
  }
  new_values.sort();
  return {values: new_values};
}

