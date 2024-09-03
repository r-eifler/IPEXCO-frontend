import { IterationStep, StepStatus } from "./run";
import { PDDLFile } from "./files/files";
import { PlanningTask } from "./plannig-task";
import { GeneralSettings } from "./settings/general-settings";
import { DomainSpecification } from "./files/domain-specification";

export interface Project {
  _id: string;
  updated: string;
  name: string;
  public: boolean;
  user?: string;
  domainFile?: PDDLFile;
  problemFile?: PDDLFile;
  domainSpecification: DomainSpecification;
  description?: string;
  baseTask?: PlanningTask;
  settings?: GeneralSettings;
  animationSettings?: string;
  animationImage?: string;
}
