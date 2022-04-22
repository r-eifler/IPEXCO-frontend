import { USUser } from "./user-study-user";
import { DepExplanationRun, PlanRun } from "../run";

export enum UserStudyStepType {
  description = "description",
  form = "form",
  demo = "demo",
}

export interface UserStudyStep {
  type: UserStudyStepType;
  content: string;
}

export interface UserStudy {
  _id?: string;
  name: string;
  user: string;
  available: boolean;
  redirectUrl: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  steps?: UserStudyStep[];
}

export interface UserStudyDemoData {
  planRuns: { timeStamp: Date; run: PlanRun }[];
  expRuns: { timeStamp: Date; run: DepExplanationRun }[];
}

export interface UserStudyData {
  user: USUser;
  demosData: { demoId: string; data: UserStudyDemoData }[];
}
