import { inject, Injectable, InjectionToken } from "@angular/core";
import { Action, ActionCreator, createAction, Creator } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, tap } from 'rxjs';

import { UndoStackService } from "./undo-stack.service";
import { undoAction } from "./handle-undo";

export const UndoStackActions = new InjectionToken<ActionCreator<string, Creator<any[], Action>>[]>('UNDO_STACK_ACTIONS');
export const undoLastAction = createAction('[shared-state] undo last action');

@Injectable()
export class UndoStackEffect {
  private actions$ = inject(Actions);
  private undoStack = inject(UndoStackService);
  private undoStackActions = inject(UndoStackActions, { optional: true }) ?? [];

  populateUndoStack$ = createEffect(() => this.actions$.pipe(
    ofType(...this.undoStackActions),
    tap((action) => this.undoStack.push(action)),
  ), { dispatch: false });

  undoLastAction$ = createEffect(() => this.actions$.pipe(
    ofType(undoLastAction),
    map(() => this.undoStack.pop()),
    switchMap(actionToUndo => actionToUndo ? [undoAction({actionToUndo})] : []),
  ));
}
