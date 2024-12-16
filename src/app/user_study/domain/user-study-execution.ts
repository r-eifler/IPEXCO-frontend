import { UserAction } from "src/app/user_study_execution/domain/user-action";

export interface UserStudyExecution {
  user: string;
  createdAt?: Date;
  updatedAt?: Date;
  finishedAt?: Date;
  userStudy: string;
  finished?: boolean;
  accepted?: boolean;
  timeLog?: UserAction[];
  payment?: number;
}
