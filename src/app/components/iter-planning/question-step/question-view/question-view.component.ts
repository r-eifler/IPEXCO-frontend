import { takeUntil } from 'rxjs/operators';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { PlanPropertyCollectionStore } from '../../../../store/stores.store';
import { PlanProperty } from 'src/app/interface/plan-property';
import { Goal, GoalType } from '../../../../interface/goal';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, combineLatest, Subject } from 'rxjs';
import { PlanRun, ExplanationRun } from 'src/app/interface/run';
import { PddlFileUtilsService } from 'src/app/service/pddl-file-utils.service';
import { CurrentRunStore, CurrentQuestionStore } from 'src/app/store/stores.store';

@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.css']
})
export class QuestionViewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  currentRun$: Observable<PlanRun>;
  currentQuestion$: Observable<ExplanationRun>;
  planProperties$: Observable<PlanProperty[]>;

  currentHardGoals: Goal[] = [];
  questionElemsDescription: string[] = [];


  constructor(
    private  currentRunStore: CurrentRunStore,
    private currentQuestionStore: CurrentQuestionStore,
    private planPropertiesStore: PlanPropertyCollectionStore) {
    this.currentRun$ = this.currentRunStore.item$;
    this.currentQuestion$ = this.currentQuestionStore.item$;
    this.planProperties$ = this.planPropertiesStore.items$;
  }

  ngOnInit(): void {
      combineLatest([this.currentRun$, this.currentQuestion$, this.planProperties$])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([run, question, planProperties]) => {
          if (run && question && planProperties.length > 0) {
            this.currentHardGoals = run.hardGoals;
            const questionElems = this.arrayMinus(question.hardGoals, this.currentHardGoals);
            for (const elem of questionElems) {
              if (elem.goalType === GoalType.goalFact) {
                this.questionElemsDescription.push(elem.name);
              }
              if (elem.goalType === GoalType.planProperty) {
                const pp = planProperties.find(p => p.name === elem.name);
                this.questionElemsDescription.push(pp.naturalLanguageDescription);
              }
            }
          }
      });
  }

  private arrayMinus(a1: Goal[], a2: Goal[]): Goal[] {
    return a1.filter(r => !a2.some(g => r.name === g.name));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
