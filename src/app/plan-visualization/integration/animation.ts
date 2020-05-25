import { Task } from '../plugins/task';
import { Action } from 'src/app/interface/plan';


export abstract class PlanVisualization {

  constructor(protected task: Task) {}

  abstract animateAction(action: Action): Promise<void>;
  abstract reverseAnimateAction(action: Action): Promise<void>;
  abstract restart(): void;
}
