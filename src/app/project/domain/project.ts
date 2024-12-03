import { DomainSpecification } from "src/app/shared/domain/domain-specification";
import { PlanningTask } from "src/app/shared/domain/planning-task";
import { GeneralSettings } from "./general-settings";


export interface Project {
  _id?: string;
  updated?: string;
  name: string;
  public: boolean;
  user?: string;
  domainSpecification: DomainSpecification;
  description?: string;
  baseTask?: PlanningTask;
  settings: GeneralSettings;
  animationSettings?: string;
  animationImage?: string;
}
