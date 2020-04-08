import {PlanProperty} from './plan-property';
import {Project} from './project';

export enum Status {
  pending,
  running,
  failed,
  finished
}

export interface  Run {
  _id: string;
  name: string;
  status: Status;
  project: Project;
  hard_properties: PlanProperty[];
  soft_properties: PlanProperty[];
  log: string;
  result: string;
}
