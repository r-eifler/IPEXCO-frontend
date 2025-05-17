import { Action, createAction, props } from "@ngrx/store";

export const undoAction = createAction('[shared-state] undo action', props<{ actionToUndo: Action }>());
