import { PDDLFact } from "src/app/interface/planning-task";


export interface PPConflict {
  _id?: string;
  elems: string[];
}

export interface PPDependencies {
  _id?: string;
  conflicts: PPConflict[];
}

export interface RelaxationExplanationNode {
  name: string;
  dependencies: PPDependencies;
  updates: PDDLFact[];
  lower_cover: number[];
  upper_cover: number[];
}
