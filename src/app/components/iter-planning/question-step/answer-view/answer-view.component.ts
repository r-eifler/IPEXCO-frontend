import {PlanProperty} from '../../../../interface/plan-property/plan-property';
import {takeUntil} from 'rxjs/operators';
import {PlanPropertyMapService} from 'src/app/service/plan-properties/plan-property-services';
import {combineLatest, Observable, Subject} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExplanationRun, PlanRun} from 'src/app/interface/run';
import {SelectedPlanRunService} from '../../../../service/planner-runs/selected-planrun.service';
import {SelectedQuestionService} from '../../../../service/planner-runs/selected-question.service';
import {TimeLoggerService} from '../../../../service/logger/time-logger.service';

interface Answer {
  MUGS: string[];
}

@Component({
  selector: 'app-explanation-view',
  templateUrl: './answer-view.component.html',
  styleUrls: ['./answer-view.component.css']
})
export class AnswerViewComponent implements OnInit, OnDestroy {

  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  currentRun$: Observable<PlanRun>;
  currentQuestion$: Observable<ExplanationRun>;

  public solvable: boolean;
  planForQuestionExists = true;

  filteredMUGS: PlanProperty[][] = [];

  constructor(
    private timeLogger: TimeLoggerService,
    private  currentRunService: SelectedPlanRunService,
    private currentQuestionService: SelectedQuestionService,
    private planPropertiesService: PlanPropertyMapService) {

    this.currentRun$ = this.currentRunService.getSelectedObject();
    this.currentQuestion$ = this.currentQuestionService.getSelectedObject();
  }

  ngOnInit(): void {
    this.loggerId = this.timeLogger.register('answer');

    combineLatest(
      [
        this.currentRun$,
        this.currentQuestion$,
        this.planPropertiesService.getMap()])
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      ([planRun, expRun, planProperties]) => {
        if (planRun && expRun && planProperties) {
          this.timeLogger.addInfo(this.loggerId, 'runId: ' + planRun._id);
          this.timeLogger.addInfo(this.loggerId, 'expRunId: ' + expRun._id);

          this.solvable = !!planRun.plan;

          if (this.solvable) {
            this.filterMUGSolvable(planRun, expRun, planProperties);
          } else {
            this.filterMUGSUnsolvable(planRun, expRun, planProperties);
          }
        }
      }
    );
  }

  private filterMUGSolvable(planRun: PlanRun, expRun: ExplanationRun, planProperties: Map<string, PlanProperty>){
    this.filteredMUGS = [];
    // console.log('MUGS:');
    // console.log(expRun.mugs);
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
        this.planForQuestionExists = false;
        return;
      }
      if (planPropertiesEntry.length === 0) {
        continue;
      }
      this.filteredMUGS.push(planPropertiesEntry);
    }
  }

  private filterMUGSUnsolvable(planRun: PlanRun, expRun: ExplanationRun, planProperties: Map<string, PlanProperty>) {
    this.filteredMUGS = [];
    console.log('MUGS:');
    console.log(expRun.mugs);
    for (const entry of expRun.mugs) {
      if (this.isSubsetEq(entry, planRun.hardGoals)) {
        this.filteredMUGS.push(entry.map(e => planProperties.get(e)));
      }
    }
  }

  private isSubsetEq(a1: string[], a2: string[]): boolean {
    return a1.every(p => a2.includes(p));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.timeLogger.deregister(this.loggerId);
  }
}
