import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { PlanPropertyCollectionStore } from './../../../store/stores.store';
import { PlanProperty } from 'src/app/interface/plan-property';
import { Goal, GoalType } from './../../../interface/goal';
import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
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
      combineLatest([this.currentRun$, this.currentQuestion$, this.planProperties$]).subscribe(([run, question, planProperties]) => {
          console.log('#Properties: ' + planProperties.length);
          if (run && question && planProperties.length > 0) {
            console.log(planProperties);
            this.currentHardGoals = run.hardGoals;
            const questionElems = this.arrayMinus(question.hardGoals, this.currentHardGoals);
            for (const elem of questionElems) {
              if (elem.goalType === GoalType.goalFact) {
                this.questionElemsDescription.push(elem.name);
              }
              if (elem.goalType === GoalType.planProperty) {
                console.log(elem.name);
                const pp = planProperties.find(p => p.name = elem.name);
                this.questionElemsDescription.push(pp.naturalLanguageDescription);
              }
            }
          }
      });
  }

  private arrayMinus(a1: Goal[], a2: Goal[]): Goal[] {
    return a1.filter(r => !a2.some(g => r.name === g.name));
  }

}
