import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Demo} from 'src/app/interface/demo';
import {ActivatedRoute, Router} from '@angular/router';
import {ExecutionSettingsService} from '../../../service/settings/execution-settings.service';
import {PlanRunsService} from '../../../service/planner-runs/planruns.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-demo-finished',
  templateUrl: './demo-finished.component.html',
  styleUrls: ['./demo-finished.component.css']
})
export class DemoFinishedComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  demo: Demo;
  timesUp = false;
  bestPlanValue = 0;

  constructor(
    public settingsService: ExecutionSettingsService,
    public runsService: PlanRunsService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<DemoFinishedComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.timesUp = data.timesUp;
    this.demo = data.demo;
  }

  async ngOnInit() {
    const bestRun = await this.runsService.getBestRun();
    if (bestRun) {
      this.bestPlanValue = bestRun.planValue;
    } else {
      this.bestPlanValue = 0;
    }
    this.settingsService.getSelectedObject().subscribe(
      s => console.log(s)
    );
  }

  backToDemoOverview() {
    // this.router.navigate(['/demos'], { relativeTo: this.route });
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
