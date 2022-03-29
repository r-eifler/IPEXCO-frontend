import { PlanProperty } from 'src/app/interface/plan-property/plan-property';

export class PPConflict {
  elems: PlanProperty[];
}

export class PPDependencies {

  conflicts: PPConflict[];

  constructor(dep: PPConflict[]) {
    this.conflicts = dep
  }

  static parse(result: string): PPDependencies {
    // TODO: implement
    return new PPDependencies([]);
  }

  addMUGS(con: PPConflict): void {
    this.conflicts.push(con)
  }
}
