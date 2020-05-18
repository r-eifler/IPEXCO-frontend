import { Task } from '../plugins/task';
import { Action } from '../interface/plan';

export abstract class Animation {

  constructor(protected task: Task) {}

  abstract animateAction(action: Action): Promise<void>;
  abstract reverseAnimateAction(action: Action): Promise<void>;
  abstract restart(): void;
}
