export enum UserStudyStepType {
  description = 'description',
  form = 'form',
  demo = 'demo',
  demoInfo = 'demoInfo',
  toolDescription = 'toolDescription'
}

export interface UserStudyStep {
  type: UserStudyStepType;
  name: string,
  time: number | null;
  content: string | null;
}

export interface UserStudy {
  _id?: string;
  updated?: string;
  name: string;
  user?: string;
  available?: boolean;
  redirectUrl: string;
  description: string;
  relatedProject: string;
  expectation: string;
  confidentiality: string;
  startDate?: Date;
  endDate?: Date;
  steps?: UserStudyStep[];
}
