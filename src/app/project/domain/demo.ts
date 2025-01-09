import { Project } from 'src/app/shared/domain/project';
import { GlobalExplanation } from '../../iterative_planning/domain/explanation/explanations';
import { RunStatus } from '../../iterative_planning/domain/run';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';


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


export function computeMaxPossibleUtility(demo: Demo, planProperties: PlanProperty[]): number {
  if(!demo || ! planProperties){
    return undefined;
  }
  let MGCS = demo.globalExplanation.MGCS 
  if(!Array.isArray(MGCS)){
    MGCS = JSON.parse(demo.globalExplanation.MGCS as unknown as string) 
  }

  const utilityOfAllMSGS = MGCS.map(mgcs =>
    planProperties.map(
      pp => !mgcs.includes(pp._id) ? pp.utility : 0).reduce((p,c) => p + c, 0)
    )
  return Math.max(...utilityOfAllMSGS);
}