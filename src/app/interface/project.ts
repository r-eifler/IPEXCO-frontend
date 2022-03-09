import {DomainSpecificationFile, PDDLFile} from './files/files';
import { PlanningTask } from './plannig-task';
import { ExecutionSettings } from './settings/execution-settings';

export interface Project {
  _id: string;
  name: string;
  user?: string;
  domainFile?: PDDLFile;
  problemFile?: PDDLFile;
  domainSpecification?: DomainSpecificationFile;
  description?: string;
  baseTask?: PlanningTask;
  properties?: string[];
  settings?: ExecutionSettings;
  animationSettings?: string;
  animationImage?: string;
}

