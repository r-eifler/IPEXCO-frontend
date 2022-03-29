import { PlanningTask } from 'src/app/interface/plannig-task';
import { PPDependencies, PPConflict } from './explanations';
import {PlanProperty} from './plan-property/plan-property';
import {Project} from './project';
import {Plan} from './plan';
import { ModifiedPlanningTask } from './planning-task-relaxation';
import { handlePlanString } from '../service/planner-runs/utils';

export enum StepStatus{
  unknown,
  solvable,
  unsolvable,
}

export enum RunStatus {
  pending,
  running,
  failed,
  finished,
  noSolution,
  notStarted,
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
    hardGoals: PlanProperty[], softGoals: PlanProperty[], task: ModifiedPlanningTask, plan: PlanRun) {
      this.name = name;
      this.project = project;
      this.status = status;
      this.hardGoals = hardGoals;
      this.softGoals = softGoals;
      this.task = task;
      this.plan = plan;
      if(this.plan) {
        this.plan = plan;
        if(this.plan.status == RunStatus.finished)
          this.plan.initPlan(this.task.basetask);
      }
    }

  static fromObject(step: IterationStep){
    let plan = null;
    if (step.plan) {
      plan = PlanRun.fromObject(step.plan);
    }
    let nStep = new IterationStep(step.name, step.project, step.status, step.hardGoals, step.softGoals, ModifiedPlanningTask.fromObject(step.task), plan);
    if (step._id){
      nStep._id = step._id;
    }
    return nStep;
  }

  canBeModified(): boolean {
    return false;
  }

  hasPlan(): boolean {
    return this.plan && this.plan.status == RunStatus.finished;
  }

  notSolvable(): boolean {
    return this.status == StepStatus.unsolvable || (this.plan && this.plan.status == RunStatus.noSolution);
  }

  isPending(): boolean {
    return this.plan && this.plan.status == RunStatus.pending;
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

export class ModIterationStep extends IterationStep{

  baseStep: IterationStep

  constructor(name, baseStep: IterationStep) {
      let newModTask: ModifiedPlanningTask = {name: baseStep.task.name, project: baseStep.project as string, basetask: baseStep.task.basetask, initUpdates: [...baseStep.task.initUpdates]}
      console.log(newModTask);
      super(name, baseStep.project, StepStatus.unknown, [...baseStep.hardGoals], [...baseStep.softGoals], newModTask, null)
      this.baseStep = baseStep;
    }

    canBeModified(): boolean {
      return true;
    }

    hasPlan(): boolean {
      return false;
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

  static fromObject(o : PlanRun): PlanRun {
    let run = new PlanRun(o.name, o.status);
    run._id = o._id;
    run.createdAt = o.createdAt;
    run.log = o.log;
    run.result = o.result;
    run.satPlanProperties = o.satPlanProperties;
    return run;
  }

  initPlan(task: PlanningTask): void {
    handlePlanString(this.result, this, task);
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

