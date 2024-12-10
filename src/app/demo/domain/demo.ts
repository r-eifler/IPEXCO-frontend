import { Project } from 'src/app/shared/domain/project';
import { GlobalExplanation } from '../../iterative_planning/domain/explanation/explanations';
import { RunStatus } from '../../iterative_planning/domain/run';


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
  globalExplanation?: GlobalExplanation,
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
