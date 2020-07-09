import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResponsiveService} from 'src/app/service/responsive/responsive.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {PlanRunsService} from 'src/app/service/planner-runs/planruns.service';
import {switchMap, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {SelectedPlanRunService} from '../../../../service/planner-runs/selected-planrun.service';

@Component({
  selector: 'app-question-step',
  templateUrl: './question-step.component.html',
  styleUrls: ['./question-step.component.css']
})
export class QuestionStepComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  isMobile: boolean;

  constructor(
    private responsiveService: ResponsiveService,
    private route: ActivatedRoute,
    private router: Router,
    private runService: PlanRunsService,
    currentRunService: SelectedPlanRunService) {

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.runService.getObject(params.get('runid'))
      )
    )
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      currentRunService.saveObject(value);
    });
  }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( isMobile => {
      this.isMobile = isMobile;
    });
    this.responsiveService.checkWidth();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
