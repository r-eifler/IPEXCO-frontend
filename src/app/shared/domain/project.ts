import { GeneralSettings } from "src/app/project/domain/general-settings";
import { PlanningTask } from "src/app/shared/domain/planning-task";

export type ProjectType = 'demo-project' | 'general-project';

export interface ProjectBase {
  name: string;
  public: boolean;
  domain: string; 
  description: string;
  instanceInfo: string;
  baseTask: PlanningTask;
  settings: GeneralSettings;
  summaryImage: string | null;
}

export interface Project extends ProjectBase {
  _id: string;
  itemType: ProjectType,
  updated: string;
  user: string;
}
