import { object, string, infer as zinfer, boolean } from "zod";

export const ProjectMetaZ  = object({
	_id: string(),
	name: string(),
	public: boolean(),
	user: string()
});

export type ProjectMetaData = zinfer<typeof ProjectMetaZ>;
