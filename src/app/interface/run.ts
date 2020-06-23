import {PlanProperty} from './plan-property';
import {Project} from './project';
import {Goal} from './goal';
import { Plan } from './plan';

export enum RunStatus {
  pending,
  running,
  failed,
  finished,
  noSolution,
}

export enum RunType {
  plan = 'PLAN',
  mugs = 'MUGS',
}

export interface  ExplanationRun {
  _id: string;
  name: string;
  type: RunType;
  status: RunStatus;
  planProperties: PlanProperty[];
  hardGoals: Goal[];
  softGoals: Goal[];
  log: string;
  result: string;
  mugs?: string[][];
}

export interface  PlanRun {
  _id: string;
  name: string;
  type: RunType;
  status: RunStatus;
  project: Project;
  planProperties: PlanProperty[];
  hardGoals: Goal[];
  log: string;
  planPath?: string;
  planString?: string;
  plan?: Plan;
  satPlanProperties?: string[];
  explanationRuns: ExplanationRun[];
  previousRun: string;
}
