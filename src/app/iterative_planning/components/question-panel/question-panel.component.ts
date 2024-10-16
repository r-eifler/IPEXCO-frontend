import { Component, Input, input, OnInit } from '@angular/core';
import { PlanProperty } from '../../domain/plan-property/plan-property';
import { IterationStep } from '../../domain/iteration_step';
import { ExplanationTemplate } from '../../domain/explanation/explanation_templates';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { UnformattedModule } from 'src/app/shared/component/unformatted/unformatted.module';
import { QuoteModule } from 'src/app/shared/component/quote/quote.module';
import { Store } from '@ngrx/store';
import { registerGlobalExplanationComputation } from '../../state/iterative-planning.actions';
import { MatButtonModule } from '@angular/material/button';
import { selectIterativePlanningIterationSteps, selectIterativePlanningProperties } from '../../state/iterative-planning.selector';
import { first, Observable, take } from 'rxjs';
import { AnswerType, ExplanationRunStatus } from '../../domain/explanation/explanations';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-question-panel',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, UnformattedModule, QuoteModule, MatButtonModule, MatCardModule, MatListModule],
  templateUrl: './question-panel.component.html',
  styleUrl: './question-panel.component.scss'
})
export class QuestionPanelComponent implements OnInit{

  property = input<PlanProperty | null>();
  planProperties = input.required<Record<string,PlanProperty> | null>();
  template = input.required<ExplanationTemplate | null>();
  step = input.required<IterationStep | null>();

  answerPhrase: string;
  answerSetsIds: string[][] 
  answerSets: PlanProperty[][] 

  explanationAvailable: boolean;

  constructor(
    private store: Store
  ){}

  ngOnInit(): void {

    this.explanationAvailable = !!this.step().globalExplanation && this.step().globalExplanation.status == ExplanationRunStatus.finished

    if(this.explanationAvailable){
      let answerBase = this.template().answerType == AnswerType.MUGS ?  this.step().globalExplanation.MUGS : this.step().globalExplanation.MGCS;
      [this.answerPhrase, this.answerSetsIds] = this.template().answerComputer(this.step(), null, answerBase, true);
      this.answerSets = this.answerSetsIds.map(set => set.map(id => this.planProperties()[id]));
    }
  }

  computeAnswer() {
    console.log('registerGlobalExplanationComputation')
    this.store.dispatch(registerGlobalExplanationComputation({iterationStepId: this.step()._id}))
  }
  
}
