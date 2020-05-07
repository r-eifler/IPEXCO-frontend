
export interface SchemaObject {
  name: string;
  type: string;
}

export interface SchemaPredicat {
  name: string;
  arguments: string[];
}

export interface SchemaAction {
  name: string;
  parameters: {name: string; type: string}[];
}


export interface TaskSchema {
  types: string[];
  objects: SchemaObject[];
  actions: SchemaAction[];
  init: string[];
  goal: string[];
}
