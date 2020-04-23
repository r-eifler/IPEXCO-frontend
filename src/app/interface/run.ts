import {PlanProperty} from './plan-property';
import {Project} from './project';
import {Goal} from './goal';

export enum Status {
  pending,
  running,
  failed,
  finished
}

export enum RunType {
  plan = 'PLAN',
  mugs = 'MUGS',
}

// export interface  Run {
//   _id: string;
//   name: string;
//   type: RunType;
//   project: Project;
//   planProperties: PlanProperty[];
//   hardGoals: Goal[];
//   softGoals: Goal[];
//   log: string;
//   result: string;
//   plan: string;
//   status: Status;
//   previousRun: string;
// }

export interface  ExplanationRun {
  _id: string;
  name: string;
  type: RunType;
  status: Status;
  planProperties: PlanProperty[];
  hardGoals: Goal[];
  softGoals: Goal[];
  log: string;
  result: string;
}

export interface  PlanRun {
  _id: string;
  name: string;
  type: RunType;
  status: Status;
  project: Project;
  planProperties: PlanProperty[];
  hardGoals: Goal[];
  log: string;
  plan: string;
  explanationRuns: ExplanationRun[];
  previousRun: string;
}
