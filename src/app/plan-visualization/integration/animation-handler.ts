import { Plan } from '../../interface/plan';
import { AnimationNoMystery } from '../plugins/nomystery3D/animation-nomystery';
import { BehaviorSubject } from 'rxjs';
import { NoMysteryTask } from '../plugins/nomystery/nomystery-task';
import { PlanVisualization } from './animation';
import {NoMystery3DVisualization} from '../plugins/nomystery3D/initializer';

export class AnimationHandler {

private animation: PlanVisualization;

private index = 0;
private paused = true;

public currentAnimationHasNextEvent: BehaviorSubject<boolean> = new BehaviorSubject(true);
public currentAnimationHasPreviousEvent: BehaviorSubject<boolean> = new BehaviorSubject(false);
public currentAnimationPausedEvent: BehaviorSubject<boolean> = new BehaviorSubject(true);


constructor(private task: NoMysteryTask, private plan: Plan) {

  this.animation = new NoMystery3DVisualization(this.task);
}



async play() {
  this.paused = false;
  while (this.index < this.plan.actions.length && ! this.paused) {
    console.log('play');
    this.nextPlayingEvent();
    await this.animation.animateAction(this.plan.actions[this.index++]);
    this.nextEvents();
  }
  this.nextPausedEvent();
}

pause() {
  this.paused = true;
}

stepBack() {
  if (this.index > 0) {
    this.animation.reverseAnimateAction(this.plan.actions[--this.index]);
    this.nextEvents();
  }
}

stepForward() {
  if (this.index < this.plan.actions.length) {
    this.animation.animateAction(this.plan.actions[this.index++]);
    this.nextEvents();
  }
}

public nextEvents() {
  this.currentAnimationHasNextEvent.next(this.index < this.plan.actions.length);
  this.currentAnimationHasPreviousEvent.next(this.index > 0);
}

private nextPausedEvent() {
  this.currentAnimationPausedEvent.next(true);
}

private nextPlayingEvent() {
  console.log('playing');
  this.currentAnimationPausedEvent.next(false);
}

restart() {
  this.index = 0;
  this.animation.restart();
}


}
