import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Demo} from 'src/app/interface/demo';
import {ActivatedRoute, Router} from '@angular/router';
import {ExecutionSettingsService} from '../../../service/settings/execution-settings.service';
import {PlanRunsService} from '../../../service/planner-runs/planruns.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TimeLoggerService} from '../../../service/logger/time-logger.service';

@Component({
  selector: 'app-demo-finished',
  templateUrl: './demo-finished.component.html',
  styleUrls: ['./demo-finished.component.css']
})
export class DemoFinishedComponent implements OnInit, OnDestroy {

  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  demo: Demo;
  timesUp = false;
  bestPlanValue = 0;
  maxUtilityAchieved: boolean;

  constructor(
    private timeLogger: TimeLoggerService,
    public settingsService: ExecutionSettingsService,
    public runsService: PlanRunsService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<DemoFinishedComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.timesUp = data.timesUp;
    this.maxUtilityAchieved = data.maxUtilityAchieved;
    this.demo = data.demo;
  }

  async ngOnInit() {
    this.loggerId = this.timeLogger.register('finished-demo');
    this.timeLogger.addInfo(this.loggerId, 'demoId: ' + this.demo._id);
    const bestRun = await this.runsService.getBestRun();
    if (bestRun) {
      this.bestPlanValue = bestRun.planValue;
    } else {
      this.bestPlanValue = 0;
    }
    this.timeLogger.addInfo(this.loggerId, 'max utility: ' + this.bestPlanValue);
    this.settingsService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  backToDemoOverview() {
    // this.router.navigate(['/demos'], { relativeTo: this.route });
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.timeLogger.deregister(this.loggerId);
  }

}
