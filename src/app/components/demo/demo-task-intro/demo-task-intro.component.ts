import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {PlanPropertyMapService} from '../../../service/plan-properties/plan-property-services';
import {TaskSchema} from '../../../interface/task-schema';
import {PlanProperty} from '../../../interface/plan-property/plan-property';
import {BehaviorSubject, Observable} from 'rxjs';
import {RunningDemoService} from '../../../service/demo/demo-services';
import {Demo} from '../../../interface/demo';
import {ExecutionSettings} from '../../../interface/settings/execution-settings';
import {MatStepper} from '@angular/material/stepper';
import {environment} from '../../../../environments/environment';
import {MatButton} from '@angular/material/button';
import {TimeLoggerService} from '../../../service/logger/time-logger.service';

@Component({
  selector: 'app-demo-task-intro',
  templateUrl: './demo-task-intro.component.html',
  styleUrls: ['./demo-task-intro.component.css']
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
    planPropertiesService: PlanPropertyMapService,
  ) {
    this.demo$ = runningDemoService.getSelectedObject();
    this.planPropertiesMap$ = planPropertiesService.getMap();
  }

  ngOnInit(): void {
    this.loggerId = this.timeLogger.register('demo-task-intro');
  }

  ngOnDestroy(): void {
    this.timeLogger.deregister(this.loggerId);
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
