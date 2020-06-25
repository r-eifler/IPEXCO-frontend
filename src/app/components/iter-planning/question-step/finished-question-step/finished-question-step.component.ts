import { Component, OnInit, OnDestroy } from '@angular/core';
import { CurrentRunService, RunService, CurrentQuestionService } from 'src/app/service/run-services';
import { PlanPropertyMapService} from 'src/app/service/plan-property-services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map, takeUntil } from 'rxjs/operators';
import { ExplanationRun } from 'src/app/interface/run';
import { ResponsiveService } from 'src/app/service/responsive.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-finished-question-step',
  templateUrl: './finished-question-step.component.html',
  styleUrls: ['./finished-question-step.component.css']
})
export class FinishedQuestionStepComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  isMobile: boolean;

  constructor(
    private responsiveService: ResponsiveService,
    private runService: RunService,
    private route: ActivatedRoute,
    private currentRunService: CurrentRunService,
    private currentQuestionService: CurrentQuestionService) {

      // TODO simplify code !!!
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this.runService.getObject(params.get('runid')))
          )
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(planRun => {
            this.currentRunService.saveObject(planRun);
            this.route.paramMap
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
              (params2: ParamMap) => {
                const expRun = planRun.explanationRuns.find((value => value._id === params2.get('expid')));
                if (expRun) {
                  this.currentQuestionService.saveObject(expRun);
                }
              });
        });
  }


  ngOnInit(): void {
    this.responsiveService.getMobileStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.responsiveService.checkWidth();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
