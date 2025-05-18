import { Action, ActionReducer, createAction, MetaReducer, props, } from "@ngrx/store";

export const undoAction = createAction('[shared-state] undo action', props<{ actionToUndo: Action }>());

export function createUndoReducer<T>(
  bufferSize?: number,
): MetaReducer<T, Action> {
  let actionsToReplay: Action[] = [];
  let replayBaseState: T;

  function handleUndo(
    nextReducer: ActionReducer<T, Action>,
  ): ActionReducer<T, Action> {
    function removeActionToUndo(actionToRemove: Action): void {
      actionsToReplay = actionsToReplay.filter((action) => action !== actionToRemove);
    }

    function recomputeState(): T {
      return actionsToReplay.reduce((state, action) => nextReducer(state, action), replayBaseState);
    }

    function appendToActionStack(action: Action): void {
      if (!action.type?.startsWith('@ngrx')) {
        actionsToReplay.push(action);
      }
    }

    function adjustBuffer() {
      if (bufferSize && actionsToReplay.length === bufferSize + 1) {
        const firstAction = actionsToReplay[0];

        replayBaseState = nextReducer(replayBaseState, firstAction);

        actionsToReplay = actionsToReplay.slice(1, bufferSize + 1);
      }
    }

    return (state: T | undefined, action: Action): T => {
      if (action.type === undoAction.type) {
        removeActionToUndo((action as Action & { actionToUndo: Action }).actionToUndo);

        return recomputeState();
      }

      appendToActionStack(action);

      adjustBuffer();

      return nextReducer(state, action);
    };
  }

  return handleUndo;
}
