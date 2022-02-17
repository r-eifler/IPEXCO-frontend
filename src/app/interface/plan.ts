export interface Action {
  name: string;
  args: string[];
  precondition: string[];
  effects: string[];
}

export interface Plan {
  actions: Action[];
  cost: number;
}

export class State {

  values: string[]

  constructor(values){
    this.values = values;
  }

  nextState(action: Action): State {
    // console.log(action.name);
    // console.log(this.values);
    let new_values = [...this.values];
    for (const eff of action.effects){
      if (eff.startsWith('!')){
        const index = new_values.indexOf(eff.replace('! ',''));
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
