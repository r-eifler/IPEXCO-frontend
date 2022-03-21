import { PPDependencies, PPConflict } from './explanations';
import {PlanProperty} from './plan-property/plan-property';
import {Project} from './project';
import {Plan} from './plan';
import { ModifiedPlanningTask } from './planning-task-relaxation';

export enum StepStatus{
  unknown,
  solvable,
  unsolvable
}

export enum RunStatus {
  pending,
  running,
  failed,
  finished,
  noSolution,
}

export class IterationStep{
  _id: string;
  name: string;
  createdAt?: Date;
  project: Project | string;
  status: StepStatus;
  hardGoals: PlanProperty[];
  softGoals: PlanProperty[];
  task: ModifiedPlanningTask;
  plan: PlanRun | null;
  depExplanations: DepExplanationRun[];
  predecessorStep: IterationStep | null;

  constructor(name: string, project: Project | string, status: StepStatus,
    hardGoals: PlanProperty[], softGoals: PlanProperty[], task: ModifiedPlanningTask) {
      this.name = name;
      this.project = project;
      this.status = status;
      this.hardGoals = hardGoals;
      this.softGoals = softGoals;
      this.task = task;
    }

  planValue(): number | null {
    if (this.status == StepStatus.unknown){
      return null;
    }
    if (this.status == StepStatus.unsolvable){
      return 0;
    }
    return this.hardGoals.reduce((acc, cur) => acc + cur.value, 0)
  }

}

export class PlanRun{
  _id?: string;
  createdAt?: Date;
  name: string;
  status: RunStatus;
  log?: string;
  result?: string;
  satPlanProperties?: PlanProperty[];
  plan?: Plan;

  constructor (name: string, status: RunStatus) {
    this.name = name;
    this.status = status;
  }

  planValue() {
    return this.satPlanProperties.reduce((acc, cur) => acc + cur.value, 0)
  }
}

export class DepExplanationRun{
  _id: string;
  createdAt?: Date;
  name: string;
  status: RunStatus;
  hardGoals: PlanProperty[];
  softGoals: PlanProperty[];
  log: string;
  result: string;
  dependencies?: PPDependencies;
  relaxationExplanations?: RelaxationExplanationRun[];
}

export class RelaxationExplanationRun{
  _id: string;
  createdAt?: Date;
  name: string;
  status: RunStatus;
  conflict: PPConflict;
  log: string;
  result: string;
}

