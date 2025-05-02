import { createAction, props } from "@ngrx/store";
import { Project } from "src/app/shared/domain/project";
import { BelugaProblem, Side } from "../../shared/domain/beluga_problem";
import { BelugaAction } from "../../shared/domain/beluga_plan";
import { DragSource } from "./builder.reducer";
import { BelugaState } from "../../shared/domain/beluga_state";

// project

export const loadProject = createAction('[beluga-builder] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[beluga-builder] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[beluga-builder] load project failure', props<{err: any}>());

// init builder

export const initBuilder = createAction('[beluga-builder] init task', props<{task: BelugaProblem, initState: BelugaState}>());


// Beluga actions

export const createNewBelugaAction = createAction('[beluga-builder] new Beluga action', props<{action: BelugaAction}>());

export const nextFlight = createAction('[beluga-builder] nextFlight');


// drag & drop

export const startDrag = createAction('[beluga-builder] start drag', props<{source: DragSource, jigName: string, sides: Side[]}>());
export const stopDrag = createAction('[beluga-builder] stop drag', props<{target: DragSource}>());
export const cancelDrag = createAction('[beluga-builder] cancel drag');