import { Action, ActionCreator, ActionReducer, createAction, MetaReducer } from "@ngrx/store";
import { any } from "ramda";

import { undoAction } from "./handle-undo";

export const undoLastAction = createAction('[shared-state] undo last action');

export function createUndoStackReducer<T>(
  actionsToCollect: ActionCreator[],
  bufferSize?: number,
): MetaReducer<T, Action> {
  let undoStack: Action[] = [];

  function undoStackReducer(nextReducer: ActionReducer<T, Action>): ActionReducer<T, Action> {
    function populateUndoStack(action: Action): void {
      const shouldBeCollected = any((actionToCollect: ActionCreator) => actionToCollect.type === action.type)(actionsToCollect)

      if (!shouldBeCollected) {
        return;
      }

      undoStack.push(action);
    }

    function determineNextAction(action: Action): Action {
      if (! (action.type === undoLastAction.type)) {
        return action;
      }

      const lastAction = undoStack.pop();
      if (!lastAction) {
        return action;
      }

      return undoAction({ actionToUndo: lastAction });
    }

    function adjustBuffer() {
        if (! bufferSize || undoStack.length !== bufferSize + 1) {
          return;
        }

        undoStack = undoStack.slice(1, bufferSize + 1);
    }


    return (state: T | undefined, action: Action): T => {
      populateUndoStack(action);
      adjustBuffer();

      const nextAction = determineNextAction(action);

      return nextReducer(state, nextAction);
    }
  }

  return undoStackReducer;
}
