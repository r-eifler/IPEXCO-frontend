import {UserStudy} from './user-study';

export interface UserStudySelection {
  userStudy: UserStudy | string;
  numberTestPersons: number;
}

export interface MetaStudy {
  _id?: string;
  user?: string;
  name: string;
  description: string;
  userStudies: UserStudySelection[];
}
