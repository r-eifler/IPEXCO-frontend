import { IterationStep, StepStatus } from "./run";
import { DomainSpecificationFile, PDDLFile } from "./files/files";
import { PlanningTask } from "./plannig-task";
import { GeneralSettings } from "./settings/general-settings";

export interface Project {
  _id: string;
  name: string;
  public: boolean;
  user?: string;
  domainFile?: PDDLFile;
  problemFile?: PDDLFile;
  domainSpecification?: DomainSpecificationFile;
  description?: string;
  baseTask?: PlanningTask;
  settings?: GeneralSettings;
  animationSettings?: string;
  animationImage?: string;
}
