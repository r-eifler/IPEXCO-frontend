import {AnimationHandler} from '../../../../plan-visualization/integration/animation-handler';
import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TimeLoggerService} from '../../../../service/logger/time-logger.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


interface Action {
  name: string;
  args: string[];
}

@Component({
  selector: 'app-plan-animation-view',
  templateUrl: './plan-animation-view.component.html',
  styleUrls: ['./plan-animation-view.component.css']
})
export class PlanAnimationViewComponent implements OnInit, AfterViewInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();
  private loggerId: number;

  @ViewChild('animationcontainer') animationContainer: ElementRef;
  @ViewChild('valuescontainer') valuesContainer: ElementRef;

  @Input()
  set visible(val: boolean) {
    if (val) {
      this.animationHandler.updateAnimationView();
    }
  }

  constructor(
    private timeLogger: TimeLoggerService,
    public animationHandler: AnimationHandler) {}

  ngAfterViewInit(): void {
    this.animationHandler.getAnimationDOMElement()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        elem => {
          if (elem) {
            this.animationContainer.nativeElement.appendChild(elem);
          }
        }
      );
    this.animationHandler.getAnimationValuesDOMElement()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        elem => {
          if (elem) {
            this.valuesContainer.nativeElement.appendChild(elem);
          }
        }
      );
    this.animationHandler.currentAnimationPausedEvent
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        elem => {
          if (elem) {
            this.timeLogger.addInfo(this.loggerId, 'pausedEvent: ' + elem);
          }
        }
      );
  }

  ngOnInit(): void {
    if (! this.loggerId) {
      this.loggerId = this.timeLogger.register('plan-animation');
    }
  }

  ngOnDestroy(): void {
    this.timeLogger.deregister(this.loggerId);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}


