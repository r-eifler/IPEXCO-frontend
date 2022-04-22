import { IterationStep, StepStatus } from "./run";
import { DomainSpecificationFile, PDDLFile } from "./files/files";
import { PlanningTask } from "./plannig-task";
import { ExecutionSettings } from "./settings/execution-settings";

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
  settings?: ExecutionSettings;
  animationSettings?: string;
  animationImage?: string;
}
