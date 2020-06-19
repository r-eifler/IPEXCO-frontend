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

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public settingsService: ExecutionSettingsService,
    private runService: RunService,
    currentRunService: CurrentRunService) {

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.runService.getObject(params.get('runid')))
    )
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      currentRunService.saveObject(value);
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
}
