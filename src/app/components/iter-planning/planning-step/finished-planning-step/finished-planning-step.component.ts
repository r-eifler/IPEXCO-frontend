import { Component, OnInit, OnDestroy } from '@angular/core';
import { RunService, CurrentRunService} from '../../../../service/run-services';
import { PlanPropertyCollectionService} from '../../../../service/plan-property-services';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ExecutionSettingsService } from 'src/app/service/execution-settings.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-finished-planning-step',
  templateUrl: './finished-planning-step.component.html',
  styleUrls: ['./finished-planning-step.component.css']
})
export class FinishedPlanningStepComponent implements OnInit, OnDestroy {

  showAnimationTab = false;

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
      currentRunService.saveObject(run);
    });

    this.currentRunService.getSelectedObject()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      run => {
        if (run && run.plan) {
          this.showAnimationTab = true;
        }
      }
    );
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
}
