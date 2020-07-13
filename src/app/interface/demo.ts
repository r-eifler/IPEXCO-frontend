import {Project} from './project';
import {RunStatus} from './run';

export interface Demo extends Project {
  summaryImage?: string;
  introduction?: string;
  status?: RunStatus;
  definition?: string;
  data?: DemoDefinition;
  taskInfo?: string;
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
