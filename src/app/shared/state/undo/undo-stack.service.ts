import { inject, Injectable, InjectionToken } from "@angular/core";
import { Action } from "@ngrx/store";

export const UndoStackBufferSize = new InjectionToken<number>('UNDO_STACK_BUFFER_SIZE');

@Injectable()
export class UndoStackService {
  private stack: Action[] = [];

  private bufferSize = inject(UndoStackService, { optional: true }) ?? 100;

  push(action: Action) {
    this.stack.push(action);

    this.adjustBuffer();
  }

  pop() {
    return this.stack.pop();
  }

  private adjustBuffer() {
      if (! this.bufferSize || this.stack.length !== this.bufferSize + 1) {
        return;
      }

      this.stack = this.stack.slice(1, this.bufferSize + 1);
  }

}
