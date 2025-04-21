import { createAction, props } from "@ngrx/store";
import { Project } from "src/app/shared/domain/project";
import { BelugaProblem } from "../../shared/domain/beluga_problem";
import { BelugaAction } from "../../shared/domain/beluga_plan";


export const loadProject = createAction('[beluga-builder] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[beluga-builder] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[beluga-builder] load project failure', props<{err: any}>());


// builder state
export const initTask = createAction('[beluga-builder] init task', props<{task: BelugaProblem}>());

// Beluga actions

export const createNewBelugaAction = createAction('[beluga-builder] new Beluga action', props<{action: BelugaAction}>());