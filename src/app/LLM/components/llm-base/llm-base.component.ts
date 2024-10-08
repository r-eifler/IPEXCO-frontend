import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { sendMessageToLLM } from '../../state/llm.actions';
import { selectIsLoading, selectMessages } from './llm-base.component.selector';
import { TranslatorRequest,QuestionTranslationRequest, GoalTranslationRequest, ExplanationTranslationRequest } from '../../translators_interfaces';

@Component({
  selector: 'app-llm-base',
  templateUrl: './llm-base.component.html',
  styleUrl: './llm-base.component.scss'
})
export class LlmBaseComponent {
  private store = inject(Store);

  messages$ = this.store.select(selectMessages);
  isLoading$ = this.store.select(selectIsLoading);

  onUserMessage(request: string) {
    const qt_request: QuestionTranslationRequest = {
      question: request,
      enforcedGoals: [],  
      satisfiedGoals: [],
      unsatisfiedGoals: [],
      existingPlanProperties: []
    }
    this.store.dispatch(sendMessageToLLM({ request: qt_request, endpoint: 'qt' } as TranslatorRequest))
  }
}
