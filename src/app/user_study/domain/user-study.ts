export enum UserStudyStepType {
  description = 'description',
  video = 'video',
  form = 'form',
  demo = 'demo',
  demoInfo = 'demoInfo',
  userManual = 'userManual',
  comprehensionCheck = 'comprehensionCheck'
}

export interface UserStudyStep {
  type: UserStudyStepType;
  name: string,
  time: number | null;
  content?: unknown;
}

export interface UserStudyDescriptionStep extends UserStudyStep{
  type: UserStudyStepType.description;
  content: string;
}

export interface UserStudyVideoStep extends UserStudyStep{
  type: UserStudyStepType.video;
  content: string;
}


export interface UserStudyFormStep extends UserStudyStep{
  type: UserStudyStepType.form;
  content: {
    link: string,
    code: string | null
  };
}

export interface UserStudyDemoStep extends UserStudyStep{
  type: UserStudyStepType.demo;
  content: string;
}

export interface UserStudyDemoInfoStep extends UserStudyStep{
  type: UserStudyStepType.demoInfo;
  content: string;
}

export interface UserStudyUserManuelStep extends UserStudyStep{
  type: UserStudyStepType.userManual;
  content: string;
}

export interface ComprehensionCheckQuestion {
  question: string;
  options: ComprehensionCheckOption[];
}

export interface ComprehensionCheckOption {
  text: string;
  isCorrect: boolean;
}

export interface UserStudyComprehensionCheckStep extends UserStudyStep{
  type: UserStudyStepType.comprehensionCheck;
  content: ComprehensionCheckQuestion[];
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
