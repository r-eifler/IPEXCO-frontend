import { LogEvent } from '../../../user_study/service/time-logger.service';
import { filter, take } from 'rxjs/operators';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { PlanProperty } from "../../../shared/domain/plan-property/plan-property";
import { Demo } from "../../domain/demo";
import { MatStepper } from "@angular/material/stepper";
import { environment } from "../../../../environments/environment";
import {MatButton} from '@angular/material/button';
import { TimeLoggerService } from "../../../user_study/service/time-logger.service";
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIterativePlanningProperties } from 'src/app/iterative_planning/state/iterative-planning.selector';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MarkedPipe } from 'src/app/pipes/marked.pipe';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: "app-demo-task-intro",
    imports: [
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatListModule,
        MatTabsModule,
        MarkedPipe,
        AsyncPipe,
    ],
    templateUrl: "./demo-task-intro.component.html",
    styleUrls: ["./demo-task-intro.component.css"]
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
