import {Component, OnDestroy, OnInit} from '@angular/core';
import {IterationStepsService} from 'src/app/service/planner-runs/iteration-steps.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {ResponsiveService} from 'src/app/service/responsive/responsive.service';
import {Subject} from 'rxjs';
import {SelectedPlanRunService} from '../../../../service/planner-runs/selected-planrun.service';
import {SelectedQuestionService} from '../../../../service/planner-runs/selected-question.service';

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
    private runService: IterationStepsService,
    private route: ActivatedRoute,
    private currentRunService: SelectedPlanRunService,
    private currentQuestionService: SelectedQuestionService) {

      this.route.params
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          params => {
            const planRunId = params.runid;
            const expRunId = params.expid;

            this.runService.getObject(planRunId)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                planRun => {
                  this.currentRunService.saveObject(planRun);
                  const expRun = planRun.explanationRuns.find((value => value._id === expRunId));
                  if (expRun) {
                    this.currentQuestionService.saveObject(expRun);
                  }
                }
              );
          }
        );
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
