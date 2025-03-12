import { GeneralSettingsZ } from "src/app/project/domain/general-settings";
import { PlanningTaskZ } from "src/app/shared/domain/planning-task";
import { boolean, nullable, object, string, enum as zenum, infer as zinfer } from "zod";


export const ProjectTypeZ = zenum(['demo-project', 'general-project']);

export type ProjectType = zinfer<typeof ProjectTypeZ>;

export const ProjectBaseZ  = object({
	name: string(),
	public: boolean(),
	domain: string(),
  description: string(),
  instanceInfo: string().nullable(),
  baseTask: PlanningTaskZ,
  settings: GeneralSettingsZ,
  summaryImage: string().nullish(),
});

export type ProjectBase = zinfer<typeof ProjectBaseZ>;

export const ProjectZ = ProjectBaseZ.merge(object({
  _id: string(),
  itemType: ProjectTypeZ,
  user: string()
}));

export type Project = zinfer<typeof ProjectZ>;
