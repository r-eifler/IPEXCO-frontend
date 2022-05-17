import { IterationStep } from "../run";

export interface UserStudyDemoData {
  demo: string;
  iterationSteps: IterationStep[];
}

export interface UserStudyData{
  _id: string;
  user: string;
  createdAt?: Date;
  userStudy: string;
  finished?: boolean;
  accepted?: boolean;
  timeLog?: string;
  payment?: number;
  demosData: UserStudyDemoData[];
}
