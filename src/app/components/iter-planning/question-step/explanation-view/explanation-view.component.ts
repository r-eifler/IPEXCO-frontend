import { PlanProperty } from './../../../../interface/plan-property';
import { DisplayTaskService } from './../../../../service/display-task.service';
import { takeUntil } from 'rxjs/operators';
import { CurrentQuestionService } from 'src/app/service/run-services';
import { CurrentRunService } from './../../../../service/run-services';
import { PlanPropertyMapService } from 'src/app/service/plan-property-services';
import { Observable, combineLatest, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlanRun, ExplanationRun } from 'src/app/interface/run';

interface Answer {
  MUGS: string[];
}

@Component({
  selector: 'app-explanation-view',
  templateUrl: './explanation-view.component.html',
  styleUrls: ['./explanation-view.component.css']
})
export class ExplanationViewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  currentRun$: Observable<PlanRun>;
  currentQuestion$: Observable<ExplanationRun>;

  filteredMUGS: PlanProperty[][] = [];

  constructor(
    private  currentRunService: CurrentRunService,
    private currentQuestionService: CurrentQuestionService,
    private planPropertiesService: PlanPropertyMapService,
    private displayTaskService: DisplayTaskService) {

    this.currentRun$ = this.currentRunService.getSelectedObject();
    this.currentQuestion$ = this.currentQuestionService.getSelectedObject();
  }

  ngOnInit(): void {
    combineLatest([ this.currentRun$, this.currentQuestion$, this.planPropertiesService.getMap(), this.displayTaskService.getSelectedObject()])
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      ([planRun, expRun, planProperties]) => {
        if (planRun && expRun && planProperties) {
          this.filteredMUGS = [];
          for (const entry of expRun.mugs) {
            const planPropertiesEntry: PlanProperty[] = [];
            for (const fact of entry) {
              // only show property if it is satisfied by the corresponding plan run
              if (planRun.satPlanProperties.find(v => v === fact) || planRun.hardGoals.find(v => v === fact)) {
                planPropertiesEntry.push(planProperties.get(fact));
              }
            }
            if (planPropertiesEntry.length === 0) {
              this.filteredMUGS = null;
              return;
            }
            this.filteredMUGS.push(planPropertiesEntry);
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
