import { devOnlyGuardedExpression } from "@angular/compiler";
import { Fact } from "./plannig-task";

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
  updates: Fact[];
  lower_cover: number[];
  upper_cover: number[];
}
