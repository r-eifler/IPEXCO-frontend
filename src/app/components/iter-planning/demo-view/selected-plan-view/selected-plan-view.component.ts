import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PlanAnimationViewComponent} from '../../planning-step/plan-animation-view/plan-animation-view.component';
import {Subject} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ExecutionSettingsService} from '../../../../service/settings/execution-settings.service';
import {PlanRunsService} from '../../../../service/planner-runs/planruns.service';
import {SelectedPlanRunService} from '../../../../service/planner-runs/selected-planrun.service';
import {switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-selected-plan-view',
  templateUrl: './selected-plan-view.component.html',
  styleUrls: ['./selected-plan-view.component.css']
})
export class SelectedPlanViewComponent implements OnInit, OnDestroy {

  hasPlan = false;

  @ViewChild('planAnimationView') planAnimationComponent: PlanAnimationViewComponent;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public settingsService: ExecutionSettingsService,
    private runService: PlanRunsService,
    public currentRunService: SelectedPlanRunService) {

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.runService.getObject(params.get('runid')))
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(run => {
        if (run) {
          currentRunService.saveObject(run);
          if (run.plan) {
            this.hasPlan = true;
          }
        }
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
