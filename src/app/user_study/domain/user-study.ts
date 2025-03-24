export enum UserStudyStepType {
  description = 'description',
  form = 'form',
  demo = 'demo',
  demoInfo = 'demoInfo',
  userManual = 'userManual'
}

export interface UserStudyStep {
  type: UserStudyStepType;
  name: string,
  time: number | null;
  content?: string;
}

export interface UserStudyBase{
  name: string;
  available: boolean;
  redirectUrl: string | null;
  description: string;
  relatedProject: string;
  expectation: string;
  confidentiality: string;
  startDate: Date | null;
  endDate: Date | null;
  steps: UserStudyStep[];
}


export interface UserStudy extends UserStudyBase{
  _id: string;
  updated: string;
  user: string;
}
