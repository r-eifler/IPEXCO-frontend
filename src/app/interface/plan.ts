export interface Action {
  name: string;
  args: string[];
}

export interface Plan {
  actions: Action[];
  cost: number;
}
