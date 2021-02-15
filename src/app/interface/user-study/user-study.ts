import {USUser} from './user-study-user';
import {ExplanationRun, PlanRun} from '../run';

export enum UserStudyStepType {
  description = 'description',
  form = 'form',
  demo = 'demo',
}

export interface UserStudyStep {
  type: UserStudyStepType;
  content: string;
}

export class UserStudy {

  _id: string;
  user: string;
  available = false;
  redirectUrl: string;

  steps: UserStudyStep[] = [];

  constructor(
    public name: string,
    public description: string,
    public startDate: string,
    public endDate: string) {

  }

  addPart(part: UserStudyStep) {
    this.steps.push(part);
  }
}

export interface UserStudyDemoData {
  planRuns: { timeStamp: Date , run: PlanRun}[];
  expRuns: { timeStamp: Date , run: ExplanationRun }[];
}

export interface UserStudyData {
  user: USUser;
  demosData: { demoId: string, data: UserStudyDemoData}[];
}
