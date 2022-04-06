import { devOnlyGuardedExpression } from "@angular/compiler";

export interface PPConflict {
  _id? : string,
  elems: string[]
}

export interface PPDependencies {
  _id? : string,
  conflicts: PPConflict[]
}
