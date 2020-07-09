import {takeUntil} from 'rxjs/operators';
import {PlanPropertyMapStore} from '../../../../store/stores.store';
import {PlanProperty} from 'src/app/interface/plan-property';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Observable, Subject} from 'rxjs';
import {ExplanationRun, PlanRun} from 'src/app/interface/run';
import {CurrentQuestionStore, CurrentRunStore} from 'src/app/store/stores.store';

@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.css']
})
export class QuestionViewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  currentRun$: Observable<PlanRun>;
  currentQuestion$: Observable<ExplanationRun>;
  planProperties$: Observable<Map<string, PlanProperty>>;

  currentHardGoals: string[] = [];
  question: PlanProperty[] = [];


  constructor(
    private  currentRunStore: CurrentRunStore,
    private currentQuestionStore: CurrentQuestionStore,
    private planPropertiesStore: PlanPropertyMapStore) {
    this.currentRun$ = this.currentRunStore.item$;
    this.currentQuestion$ = this.currentQuestionStore.item$;
    this.planProperties$ = this.planPropertiesStore.items$;
  }

  ngOnInit(): void {
      combineLatest([this.currentRun$, this.currentQuestion$, this.planProperties$])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([run, question, planProperties]) => {
        this.question = [];
        if (run && question && planProperties.size > 0) {
          this.currentHardGoals = run.hardGoals;
          const questionElems = this.arrayMinus(question.hardGoals, this.currentHardGoals.map(value => (value)));
          for (const elem of questionElems) {
              const pp = planProperties.get(elem);
              this.question.push(pp);
          }
        }
      });
  }

  private arrayMinus(a1: string[], a2: string[]): string[] {
    return a1.filter(r => !a2.some(g => r === g));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
