import { Project } from './project';
import { RunStatus } from './run';

export interface Demo {
  _id?: string;
  name: string;
  summaryImage?: string;
  project: string;
  introduction: string;
  status?: RunStatus;
  definition?: string;
  data?: DemoDefinition;
  maxRuns: number;
  maxQuestionSize: number;
  public: boolean;
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
