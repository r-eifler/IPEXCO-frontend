import {PlanProperty} from '../../../../interface/plan-property/plan-property';
import {takeUntil} from 'rxjs/operators';
import {PlanPropertyMapService} from 'src/app/service/plan-properties/plan-property-services';
import {combineLatest, Observable, Subject} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExplanationRun, PlanRun} from 'src/app/interface/run';
import {SelectedPlanRunService} from '../../../../service/planner-runs/selected-planrun.service';
import {CurrentQuestionService} from '../../../../service/planner-runs/selected-question.service';

interface Answer {
  MUGS: string[];
}

@Component({
  selector: 'app-explanation-view',
  templateUrl: './answer-view.component.html',
  styleUrls: ['./answer-view.component.css']
})
export class AnswerViewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  currentRun$: Observable<PlanRun>;
  currentQuestion$: Observable<ExplanationRun>;

  planExists = true;

  filteredMUGS: PlanProperty[][] = [];

  constructor(
    private  currentRunService: SelectedPlanRunService,
    private currentQuestionService: CurrentQuestionService,
    private planPropertiesService: PlanPropertyMapService) {

    this.currentRun$ = this.currentRunService.getSelectedObject();
    this.currentQuestion$ = this.currentQuestionService.getSelectedObject();
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.currentRun$,
        this.currentQuestion$,
        this.planPropertiesService.getMap()])
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      ([planRun, expRun, planProperties]) => {
        if (planRun && expRun && planProperties) {
          this.filteredMUGS = [];
          console.log('MUGS:');
          console.log(expRun.mugs);
          for (const entry of expRun.mugs) {
            const planPropertiesEntry: PlanProperty[] = [];
            let containsOnlyGlobalHardGoals = true;
            for (const fact of entry) {
              const p = planProperties.get(fact);
              containsOnlyGlobalHardGoals = containsOnlyGlobalHardGoals && p.globalHardGoal;
              // only show property if it is satisfied by the corresponding plan run
              if (planRun.satPlanProperties.find(v => v === fact) || planRun.hardGoals.find(v => v === fact)) {
                planPropertiesEntry.push(p);
              }
            }
            if (containsOnlyGlobalHardGoals) {
              this.planExists = false;
              return;
            }
            if (planPropertiesEntry.length === 0) {
              continue;
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
