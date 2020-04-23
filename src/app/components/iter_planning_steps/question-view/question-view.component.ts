import { Goal } from './../../../interface/goal';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanRun, ExplanationRun } from 'src/app/interface/run';
import { PddlFileUtilsService } from 'src/app/service/pddl-file-utils.service';
import { CurrentRunStore, CurrentQuestionStore } from 'src/app/store/stores.store';

@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.css']
})
export class QuestionViewComponent implements OnInit {

  currentRun$: Observable<PlanRun>;
  currentQuestion$: Observable<ExplanationRun>;

  currentHardGoals: Goal[] = [];
  questionElems: Goal[] = [];

  constructor(
    private  currentRunStore: CurrentRunStore,
    private currentQuestionStore: CurrentQuestionStore) {
    this.currentRun$ = this.currentRunStore.item$;
    this.currentQuestion$ = this.currentQuestionStore.item$;
  }

  ngOnInit(): void {
      this.currentRun$.subscribe(run => {
        if (run != null) {
          this.currentHardGoals = run.hardGoals;
        }
      });

      this.currentQuestion$.subscribe(run => {
        if (run !== null) {
          this.questionElems = this.arrayMinus(run.hardGoals, this.currentHardGoals);
        }
      });
  }

  private arrayMinus(a1: Goal[], a2: Goal[]): Goal[] {
    return a1.filter(r => !a2.some(g => r.name === g.name))
  }

}
