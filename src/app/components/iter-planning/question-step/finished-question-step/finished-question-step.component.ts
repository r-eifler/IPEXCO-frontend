import { Component, OnInit } from '@angular/core';
import { CurrentRunService, RunService, CurrentQuestionService } from 'src/app/service/run-services';
import { PlanPropertyCollectionService} from 'src/app/service/plan-property-services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { ExplanationRun } from 'src/app/interface/run';
import { ResponsiveService } from 'src/app/service/responsive.service';

@Component({
  selector: 'app-finished-question-step',
  templateUrl: './finished-question-step.component.html',
  styleUrls: ['./finished-question-step.component.css']
})
export class FinishedQuestionStepComponent implements OnInit {

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
          ).subscribe(planRun => {
            this.currentRunService.saveObject(planRun);
            console.log('Current plan run id: ' + planRun._id);
            this.route.paramMap.subscribe(
              (params2: ParamMap) => {
                console.log('Question Runs: ');
                console.log(planRun.explanationRuns);
                const expRun = planRun.explanationRuns.find((value => value._id === params2.get('expid')));
                if (expRun) {
                  console.log('Current question run id: ' + expRun._id);
                  this.currentQuestionService.saveObject(expRun);
                }
              });
        });
  }


ngOnInit(): void {
  this.responsiveService.getMobileStatus().subscribe( isMobile => {
    if (isMobile) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  });
  this.responsiveService.checkWidth();
}

}
