import { Project, ProjectBase } from 'src/app/shared/domain/project';
import { GlobalExplanation } from '../../iterative_planning/domain/explanation/explanations';
import { RunStatus } from '../../iterative_planning/domain/run';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';


export enum DemoRunStatus {
  pending,
  running,
  failed,
  finished
}

export interface DemoBase extends ProjectBase {
  projectId: string,
  status: DemoRunStatus;
  globalExplanation?: GlobalExplanation,
}

export interface Demo extends Project, DemoBase {
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


export function computeMaxPossibleUtility(demo: Demo, planProperties: PlanProperty[]): number | undefined {
  if(!demo || ! planProperties || demo.globalExplanation === undefined){
    return undefined;
  }
  let MGCS = demo.globalExplanation.MGCS 

  if(MGCS == null){
    return 0;
  }

  const utilityOfAllMSGS = MGCS.map(mgcs =>
    planProperties.map(
      pp => !mgcs.includes(pp._id) ? pp.utility : 0).reduce((p,c) => p + c, 0)
    )
  return Math.max(...utilityOfAllMSGS);
}