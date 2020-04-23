import { Component, OnInit } from '@angular/core';
import { CurrentRunService, RunService, CurrentQuestionService } from 'src/app/service/run-services';
import { PlanPropertyCollectionService} from 'src/app/service/plan-property-services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { ExplanationRun } from 'src/app/interface/run';

@Component({
  selector: 'app-finished-question-step',
  templateUrl: './finished-question-step.component.html',
  styleUrls: ['./finished-question-step.component.css']
})
export class FinishedQuestionStepComponent implements OnInit {

  constructor(
    private propertiesService: PlanPropertyCollectionService,
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
            this.route.paramMap.subscribe(
              (params2: ParamMap) => {
                console.log(planRun.explanationRuns);
                const expRun = planRun.explanationRuns.find((value => value._id === params2.get('expid')));
                if (expRun) {
                  this.currentQuestionService.saveObject(expRun);
                }
              });
        });
  }


ngOnInit(): void {
  this.propertiesService.findCollection();
}

}
