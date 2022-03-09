import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PlanRunsService} from '../../../../service/planner-runs/planruns.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {PlanAnimationViewComponent} from '../plan-animation-view/plan-animation-view.component';
import {SelectedPlanRunService} from '../../../../service/planner-runs/selected-planrun.service';
import {TimeLoggerService} from '../../../../service/logger/time-logger.service';


@Component({
  selector: 'app-finished-planning-step',
  templateUrl: './finished-planning-step.component.html',
  styleUrls: ['./finished-planning-step.component.css']
})
export class FinishedPlanningStepComponent implements OnInit, OnDestroy {

  private loggerId: number;
  hasPlan = false;
  public showTab = 3;

  @ViewChild('planAnimationView') planAnimationComponent: PlanAnimationViewComponent;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private timeLogger: TimeLoggerService,
    private route: ActivatedRoute,
    private router: Router,
    private runService: PlanRunsService,
    public currentRunService: SelectedPlanRunService) {

    this.currentRunService.getSelectedObject()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(run => {
      if (run) {
        if (this.loggerId) {
          if (! this.loggerId) {
            this.loggerId = this.timeLogger.register('task-overview');
          }
          this.timeLogger.addInfo(this.loggerId, 'runId: ' + run._id);
        }
        if (run.plan) {
          this.hasPlan = true;
        }
      }
    });
  }

  ngOnInit(): void {
    if (! this.loggerId) {
      this.loggerId = this.timeLogger.register('task-overview');
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.timeLogger.deregister(this.loggerId);
  }

  async newQuestion() {
    await this.router.navigate(['./new-question'], { relativeTo: this.route });
  }

  onAnimationFinished() {
    if (this.planAnimationComponent) {
      this.planAnimationComponent.visible = true;
    }
  }
}
