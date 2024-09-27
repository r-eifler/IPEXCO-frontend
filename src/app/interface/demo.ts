import { PPDependencies } from 'src/app/interface/explanations';
import { FactUpdate } from "./planning-task-relaxation";
import { DepExplanationRun, RelaxationExplanationRun, RunStatus } from "./run";
import { Project } from '../project/domain/project';

export interface DemoExplanation {
  initUpdates: FactUpdate[];
  relaxationExplanations: RelaxationExplanationRun[];
}

export interface Demo extends Project {
  summaryImage?: string;
  introduction?: string;
  status?: RunStatus;
  completion: number;
  definition?: string;
  conflictExplanation?: DepExplanationRun;
  explanations: DemoExplanation[];
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
