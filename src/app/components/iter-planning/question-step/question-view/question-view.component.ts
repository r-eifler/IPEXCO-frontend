import {takeUntil} from 'rxjs/operators';
import {PlanPropertyMapStore} from '../../../../store/stores.store';
import {PlanProperty} from 'src/app/interface/plan-property/plan-property';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Observable, Subject} from 'rxjs';
import { DepExplanationRun, PlanRun, RunStatus } from 'src/app/interface/run';
import {CurrentQuestionStore, CurrentRunStore} from 'src/app/store/stores.store';

@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.css']
})
export class QuestionViewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  public solvable: boolean;
  currentRun$: Observable<PlanRun>;
  currentQuestion$: Observable<DepExplanationRun>;
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
    // Get the  properties which are in the question
    // This are the properties which are in the hard-goals of the question run but not in the hard goals of the corresponding plan run
    combineLatest([this.currentRun$, this.currentQuestion$, this.planProperties$])
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(([run, question, planProperties]) => {
      this.question = [];
      if (run && question && planProperties.size > 0) {
        this.solvable = run.status == RunStatus.finished;
        if (this.solvable){
          this.currentHardGoals = [] // TODO run.hardGoals;
          const questionElements = [] // TODO this.arrayMinus(question.hardGoals, this.currentHardGoals.map(value => (value)));
          this.question = questionElements.map(elem => planProperties.get(elem));
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
