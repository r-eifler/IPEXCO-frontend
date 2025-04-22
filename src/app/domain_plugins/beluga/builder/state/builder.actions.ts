import { createAction, props } from "@ngrx/store";
import { Project } from "src/app/shared/domain/project";
import { BelugaProblem } from "../../shared/domain/beluga_problem";
import { BelugaAction } from "../../shared/domain/beluga_plan";
import { DragSource } from "./builder.reducer";


export const loadProject = createAction('[beluga-builder] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[beluga-builder] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[beluga-builder] load project failure', props<{err: any}>());


// builder state
export const initTask = createAction('[beluga-builder] init task', props<{task: BelugaProblem}>());

// Beluga actions

export const createNewBelugaAction = createAction('[beluga-builder] new Beluga action', props<{action: BelugaAction}>());

export const nextFlight = createAction('[beluga-builder] nextFlight');


// drag & drop

export const startDrag = createAction('[beluga-builder] start drag', props<{source: DragSource, jigName: string}>());
export const stopDrag = createAction('[beluga-builder] stop drag', props<{target: DragSource}>());
export const cancelDrag = createAction('[beluga-builder] cancel drag');