import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { ProjectBaseZ, ProjectZ } from 'src/app/shared/domain/project';
import { nativeEnum, nullable, object, optional, string, infer as zinfer } from 'zod';
import { GlobalExplanationZ } from '../../iterative_planning/domain/explanation/explanations';


export enum DemoRunStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  FAILED = "FAILED",
  FINISHED = "FINISHED"
}

export const DemoRunStatusZ = nativeEnum(DemoRunStatus);

export const DemoBaseZ = ProjectBaseZ.merge(object({
  projectId: nullable(string()),
  status: DemoRunStatusZ,
  globalExplanation: optional(GlobalExplanationZ),
}));

export type DemoBase = zinfer<typeof DemoBaseZ>;

export const DemoZ = ProjectZ.merge(DemoBaseZ);

export type Demo = zinfer<typeof DemoZ>;

export function computeMaxPossibleUtility(demo: Demo, planProperties: PlanProperty[]): number | undefined {
  if(!demo || ! planProperties || demo.globalExplanation === undefined || demo.globalExplanation?.MGCS == undefined){
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