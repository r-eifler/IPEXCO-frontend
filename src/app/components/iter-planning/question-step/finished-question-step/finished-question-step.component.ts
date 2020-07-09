import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrentQuestionService, CurrentRunService, RunService} from 'src/app/service/planner-runs/run-services';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {ResponsiveService} from 'src/app/service/responsive/responsive.service';
import {Subject} from 'rxjs';

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
