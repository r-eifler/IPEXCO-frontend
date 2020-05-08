import { AnimationProvider } from 'src/app/animation/animation-provider';
import { AnimationInitializerNoMystery } from './../plugins/nomystery/animation-initializer-nomystery';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../plugins/nomystery/task';
import { AnimationProviderNoMystery } from '../plugins/nomystery/animation-provider-nomystery';
import { EventEmitter } from '@angular/core';
import { AnimationInitializer } from './animation-initializer';

interface Action {
  name: string;
  args: string[];
}



export class AnimationHandler {

private animationProvider: AnimationProvider;
private animationInitializer: AnimationInitializer;

private index = 0;
private paused = true;

public currentAnimationHasNextEvent: BehaviorSubject<boolean> = new BehaviorSubject(true);
public currentAnimationHasPreviousEvent: BehaviorSubject<boolean> = new BehaviorSubject(false);
public currentAnimationPausedEvent: BehaviorSubject<boolean> = new BehaviorSubject(true);


constructor(private task: Task, private actions: Action[], protected svgContainerId: string) {
  this.animationProvider = new AnimationProviderNoMystery(task);
  this.animationInitializer = new AnimationInitializerNoMystery(svgContainerId, task);
}



async play() {
  this.paused = false;
  while (this.index < this.actions.length && ! this.paused) {
    console.log('play');
    this.nextPlayingEvent();
    await this.animationProvider.animateAction(this.actions[this.index++]);
    this.nextEvents();
  }
  this.nextPausedEvent();
}

pause() {
  this.paused = true;
}

stepBack() {
  if (this.index > 0) {
    this.animationProvider.reverseAnimateAction(this.actions[--this.index]);
    this.nextEvents();
  }
}

stepForward() {
  if (this.index < this.actions.length) {
    this.animationProvider.animateAction(this.actions[this.index++]);
    this.nextEvents();
  }
}

public nextEvents() {
  this.currentAnimationHasNextEvent.next(this.index < this.actions.length);
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
  this.animationInitializer.restart();
}


}
