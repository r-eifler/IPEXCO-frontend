export enum UserStudyStepType {
  description = 'description',
  form = 'form',
  demo = 'demo',
}

export interface UserStudyStep {
  type: UserStudyStepType;
  name: string,
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
  startDate?: Date;
  endDate?: Date;
  steps?: UserStudyStep[];
}
