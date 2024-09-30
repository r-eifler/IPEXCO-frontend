import { PPDependencies } from '../iterative_planning/domain/explanations';
import { DepExplanationRun, RunStatus } from '../iterative_planning/domain/run';
import { Project } from '../project/domain/project';


export interface Demo extends Project {
  summaryImage?: string;
  introduction?: string;
  status?: RunStatus;
  completion: number;
  definition?: string;
  conflictExplanation?: DepExplanationRun;
  explanations: any[];
  taskInfo?: string;
  maxUtility?: { value: number; selectedPlanProperties: string[] };
}

export function getSimpleConflicts(demo: Demo): PPDependencies {
  return demo.explanations[0]?.relaxationExplanations[0]?.dependencies[0]?.dependencies;
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
