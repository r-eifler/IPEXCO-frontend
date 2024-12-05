import { DomainSpecification } from "src/app/interface/files/domain-specification";
import { PDDLFile } from "src/app/interface/files/files";
import { PlanningTask } from "src/app/interface/planning-task";
import { GeneralSettings } from "./general-settings";


export interface Project {
  _id?: string;
  updated?: string;
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
