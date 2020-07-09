import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CurrentRunService, RunService} from '../../../../service/run-services';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {ExecutionSettingsService} from 'src/app/service/execution-settings.service';
import {Subject} from 'rxjs';
import {PlanAnimationViewComponent} from '../plan-animation-view/plan-animation-view.component';


@Component({
  selector: 'app-finished-planning-step',
  templateUrl: './finished-planning-step.component.html',
  styleUrls: ['./finished-planning-step.component.css']
})
export class FinishedPlanningStepComponent implements OnInit, OnDestroy {

  hasPlan = false;

  @ViewChild('planAnimationView') planAnimationComponent: PlanAnimationViewComponent;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public settingsService: ExecutionSettingsService,
    private runService: RunService,
    public currentRunService: CurrentRunService) {

    console.log('Finished planning step');
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

  newQuestion() {
    this.router.navigate(['./new-question'], { relativeTo: this.route });
  }

  onAnimationFinished() {
    if (this.planAnimationComponent) {
      this.planAnimationComponent.visible = true;
    }
  }
}
