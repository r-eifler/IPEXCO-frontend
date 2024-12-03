
import { IterationStep } from 'src/app/iterative_planning/domain/iteration_step';
import { USUser } from './user-study-user';

export interface UserStudyDemoData {
  demo: string;
  iterationSteps: IterationStep[];
}

export interface UserStudyData{
  some(arg0: (u: any) => boolean): any;
  filter(arg0: (d: any) => any): any;
  _id: string;
  user: USUser;
  createdAt?: Date;
  userStudy: string;
  finished?: boolean;
  accepted?: boolean;
  timeLog?: string;
  payment?: number;
  demosData: UserStudyDemoData[];
}
