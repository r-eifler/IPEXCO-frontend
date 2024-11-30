import { LogEvent } from './../../../service/logger/time-logger.service';
import { filter, take } from 'rxjs/operators';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { PlanPropertyMapService } from "../../../service/plan-properties/plan-property-services";
import { PlanProperty } from "../../../iterative_planning/domain/plan-property/plan-property";
import { Demo } from "../../../interface/demo";
import { MatStepper } from "@angular/material/stepper";
import { environment } from "../../../../environments/environment";
import {MatButton} from '@angular/material/button';
import { TimeLoggerService } from "../../../service/logger/time-logger.service";
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIterativePlanningProperties } from 'src/app/iterative_planning/state/iterative-planning.selector';

@Component({
  selector: "app-demo-task-intro",
  templateUrl: "./demo-task-intro.component.html",
  styleUrls: ["./demo-task-intro.component.css"],
})
export class DemoTaskIntroComponent implements OnInit, OnDestroy {
  private loggerId: number;

  @Output() next = new EventEmitter<void>();

  srcUrl = environment.srcURL;

  demo$: Observable<Demo>;
  planPropertiesMap$: Observable<Record<string, PlanProperty>>;

  constructor(
    private timeLogger: TimeLoggerService,
    // runningDemoService: RunningDemoService,
    private store: Store,
  ) {
    // this.demo$ = runningDemoService.getSelectedObject() as BehaviorSubject<Demo>;
    this.planPropertiesMap$ = this.store.select(selectIterativePlanningProperties)
  }

  ngOnInit(): void {
    this.demo$.pipe(
      filter(d => !!d),
      take(1)
    ).subscribe(d => this.timeLogger.log(LogEvent.START_READ_TASK_INTRO, {demoId: d._id}))
  }

  ngOnDestroy(): void {
    this.demo$.pipe(
      filter(d => !!d),
      take(1)
    ).subscribe(d => this.timeLogger.log(LogEvent.END_READ_TASK_INTRO, {demoId: d._id}))
  }

  nextStep() {
    this.next.emit();
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper, startButton: MatButton) {
    stepper.next();
    if (stepper.selectedIndex) {
      startButton.disabled = false;
    }
  }
}
