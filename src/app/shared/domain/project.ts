import { GeneralSettings } from "src/app/project/domain/general-settings";
import { DomainSpecification } from "src/app/shared/domain/domain-specification";
import { PlanningTask } from "src/app/shared/domain/planning-task";

export type ProjectType = 'demo-project' | 'general-project';

export interface Project {
  _id?: string;
  itemType?: ProjectType,
  updated?: string;
  name: string;
  public: boolean;
  user?: string;
  domainSpecification: DomainSpecification;
  description?: string;
  summaryImage?: string;
  domainInfo?: string;
  instanceInfo?: string;
  baseTask?: PlanningTask;
  settings: GeneralSettings;
  animationSettings?: string;
  animationImage?: string;
}
