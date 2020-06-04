import { Project } from './project';
import { RunStatus } from './run';

export interface Demo {
  _id?: string;
  name: string;
  summaryImage?: string;
  project: Project;
  introduction: string;
  status?: RunStatus;
  definition?: string;
  maxRuns: number;
  maxQuestionSize: number;
  public: boolean;
}
