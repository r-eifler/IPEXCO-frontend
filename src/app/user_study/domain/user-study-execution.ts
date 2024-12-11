export interface UserStudyExecution {
  user: string;
  createdAt?: Date;
  updatedAt?: Date;
  userStudy: string;
  finished?: boolean;
  accepted?: boolean;
  timeLog?: string;
  payment?: number;
}
