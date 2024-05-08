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
import { PlanProperty } from "../../../interface/plan-property/plan-property";
import { RunningDemoService } from "../../../service/demo/demo-services";
import { Demo } from "../../../interface/demo";
import { MatStepper } from "@angular/material/stepper";
import { environment } from "../../../../environments/environment";
import {MatButton} from '@angular/material/button';
import { TimeLoggerService } from "../../../service/logger/time-logger.service";
import { Observable } from 'rxjs';

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
  planPropertiesMap$: Observable<Map<string, PlanProperty>>;

  constructor(
    private timeLogger: TimeLoggerService,
    runningDemoService: RunningDemoService,
    planPropertiesService: PlanPropertyMapService
  ) {
    this.demo$ = runningDemoService.getSelectedObject();
    this.planPropertiesMap$ = planPropertiesService.getMap();
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
