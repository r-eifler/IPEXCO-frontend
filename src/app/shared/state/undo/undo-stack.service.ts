import { computed, inject, Injectable, InjectionToken, signal } from "@angular/core";
import { Action } from "@ngrx/store";
import { any, slice } from "ramda";

export const UndoStackBufferSize = new InjectionToken<number>('UNDO_STACK_BUFFER_SIZE');

@Injectable()
export class UndoStackService {
  private stack = signal<Action[]>([]);

  private bufferSize = inject(UndoStackBufferSize, { optional: true }) ?? 100;

  hasStackItems = computed(() => any(() => true ,this.stack()));

  clear() {
    this.stack.set([]);
  }

  push(action: Action) {
    this.stack.update(oldStack => [...oldStack, action]);

    this.adjustBuffer();
  }

  pop() {
    const lastAction = this.stack().at(-1);

    this.stack.update(oldStack => slice(0, oldStack.length - 1, oldStack));

    console.log(this.stack())

    return lastAction;
  }

  private adjustBuffer() {
      if (! this.bufferSize || this.stack().length !== this.bufferSize + 1) {
        return;
      }

      this.stack.update(oldStack => slice(1, this.bufferSize + 1, oldStack));
  }

}
