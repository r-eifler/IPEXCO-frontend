import { Task } from '../plugins/nomystery/task';

interface Action {
  name: string;
  args: string[];
}

export abstract class AnimationProvider {

  constructor(protected task: Task) {}

  abstract animateAction(action: Action): Promise<void>;
  abstract reverseAnimateAction(action: Action): Promise<void>;
}
