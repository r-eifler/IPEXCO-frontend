import { GlobalExplanation } from '../../iterative_planning/domain/explanation/explanations';
import { RunStatus } from '../../iterative_planning/domain/run';
import { Project } from './project';


export enum DemoRunStatus {
  pending,
  running,
  failed,
  finished
}

export interface Demo extends Project {
  projectId: string,
  status: DemoRunStatus;
  completion: number;
  summaryImage?: string;
  domainInfo?: string;
  instanceInfo?: string;
  maxUtility?: { value: number; selectedPlanProperties: string[] };
}

export interface DemoDefinition {
  MUGS: string[][];
  plans: {
    planProperties: string[];
    plan: string;
  }[];
  satPropertiesPerPlan: {
    planProperties: string[];
    plan: string;
  }[];
}
