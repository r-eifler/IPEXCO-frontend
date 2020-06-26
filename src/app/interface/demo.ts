import { Project } from './project';
import { RunStatus } from './run';
import { ExecutionSettings } from './execution-settings';

export interface Demo {
  _id?: string;
  name: string;
  user: string;
  summaryImage?: string;
  project: string;
  introduction: string;
  status?: RunStatus;
  definition?: string;
  data?: DemoDefinition;
  settings?: string;
}

export interface DemoDefinition {
  MUGS: string[][];
  plans: {
    planProperties: string[],
    plan: string; }[];
  satPropertiesPerPlan: {
    planProperties: string[],
    plan: string; }[];
}
