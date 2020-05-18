import { NoMysteryTask } from '../plugins/nomystery/nomystery-task';
import { Action } from '../interface/plan';
import { AnimationInfo } from './animation-info';



export abstract class AnimationProvider {

  // constructor(protected animationInfo: AnimationInfo) {}

  abstract animateAction(action: Action): Promise<void>;
  abstract reverseAnimateAction(action: Action): Promise<void>;
}
