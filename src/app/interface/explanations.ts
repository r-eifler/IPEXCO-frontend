import { devOnlyGuardedExpression } from "@angular/compiler";

export class PPConflict {
  _id? : string;
  elems: string[];

  constructor(elems) {
    this.elems = elems;
  }
}

export class PPDependencies {
  _id? : string;
  conflicts: PPConflict[];

  constructor() {
    this.conflicts = []
  }


  static fromObject(o: PPDependencies) {
    let dep = new PPDependencies();
    dep.conflicts = o.conflicts.map(c => new PPConflict(c.elems));
    return dep;
  }

  addConflict(con: PPConflict): void {
    this.conflicts.push(con)
  }
}
