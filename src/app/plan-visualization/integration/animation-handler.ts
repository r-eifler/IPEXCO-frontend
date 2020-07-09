import {CurrentRunService} from 'src/app/service/run-services';
import {Plan} from '../../interface/plan';
import {BehaviorSubject, Observable} from 'rxjs';
import {PlanVisualization} from './plan-visualization';
import {Inject, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationHandler {

private plan: Plan;

private index = 0;
private paused = true;

public currentAnimationHasNextEvent: BehaviorSubject<boolean> = new BehaviorSubject(true);
public currentAnimationHasPreviousEvent: BehaviorSubject<boolean> = new BehaviorSubject(false);
public currentAnimationPausedEvent: BehaviorSubject<boolean> = new BehaviorSubject(true);


constructor(
  private  currentRunService: CurrentRunService,
  @Inject(PlanVisualization) public animation: PlanVisualization) {
    this.currentRunService.getSelectedObject().subscribe((run) => {
      if (run) {
        this.plan = run.plan;
      }
    });
}

getAnimationDOMElement(): Observable<Element> {
  return this.animation.getDisplayDOMElem();
}

updateAnimationView() {
  this.animation.upadte();
}


async play() {
  this.paused = false;
  while (this.index < this.plan.actions.length && ! this.paused) {
    this.nextPlayingEvent();
    await this.animation.animateAction(this.plan.actions[this.index++]);
    this.nextEvents();
  }
  this.nextPausedEvent();
}

pause() {
  this.paused = true;
}

async stepBack() {
  if (this.index > 0) {
    this.nextPlayingEvent();
    await this.animation.reverseAnimateAction(this.plan.actions[--this.index]);
    this.nextPausedEvent();
    this.nextEvents();
  }
}

async stepForward() {
  if (this.index < this.plan.actions.length) {
    this.nextPlayingEvent();
    await this.animation.animateAction(this.plan.actions[this.index++]);
    this.nextPausedEvent();
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
  this.currentAnimationPausedEvent.next(false);
}

restart() {
  this.index = 0;
  this.animation.restart();
  this.nextEvents();
}


}
