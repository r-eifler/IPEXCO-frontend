export enum UserStudyStepType {
  description,
  form,
  demo,
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
