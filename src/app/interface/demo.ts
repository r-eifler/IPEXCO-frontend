import { FactUpdate } from "./planning-task-relaxation";
import { Project } from "./project";
import { RelaxationExplanationRun, RunStatus } from "./run";

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
  data?: DemoDefinition;
  explanations: DemoExplanation[];
  taskInfo?: string;
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
