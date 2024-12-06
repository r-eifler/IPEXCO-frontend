import { GlobalExplanation } from "src/app/iterative_planning/domain/explanation/explanations";
import { GeneralSettings } from "src/app/project/domain/general-settings";
import { DomainSpecification } from "src/app/shared/domain/domain-specification";
import { PlanningTask } from "src/app/shared/domain/planning-task";



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
