import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { filterNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';
import { ChatModule } from 'src/app/shared/components/chat/chat.module';
import { eraseLLMHistory, sendMessageToLLMQuestionTranslator } from '../../state/iterative-planning.actions';
import { selectIsExplanationChatLoading, selectIsLLMChatLoading, selectIterativePlanningProject, selectIterativePlanningSelectedStep, selectVisibleMessagesbyId } from '../../state/iterative-planning.selector';
import { QuestionType } from "../../domain/explanation/explanations";
import { ExplanationMessage, StructuredText } from "../../domain/interface/explanation-message";
import { PlanProperty } from "../../../shared/domain/plan-property/plan-property";
import { StructuredTextComponent } from "../structured-text/structured-text.component";
import { input } from '@angular/core';

export type AvailableQuestion = {
  message: StructuredText;
  questionType: QuestionType;
}

@Component({
    selector: 'app-explanation-chat-hybrid',
    imports: [AsyncPipe, ChatModule, MatButtonModule, MatIconModule, MatTooltipModule],
    templateUrl: './explanation-chat-hybrid.component.html',
    styleUrl: './explanation-chat-hybrid.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplanationChatHybridComponent implements OnInit, OnDestroy {
  private store = inject(Store);

  // LLM Chat functionality
  loadingState$ = this.store.select(selectIsLLMChatLoading);
  isLoading$ = this.store.select(selectIsLLMChatLoading);
  isExplanationChatLoading$ = this.store.select(selectIsExplanationChatLoading);
  isAnyLoading$ = combineLatest([this.isLoading$, this.isExplanationChatLoading$]).pipe(
    map(([isLoading, isExplanationChatLoading]) => isLoading || isExplanationChatLoading)
  );
   
  project$ = this.store.select(selectIterativePlanningProject);
  step$ = this.store.select(selectIterativePlanningSelectedStep);
  stepId$ = this.step$.pipe(map(step => step?._id));
  messages$ = this.stepId$.pipe(
    filterNotNullOrUndefined(),
    switchMap(id => this.store.select(selectVisibleMessagesbyId(id)))
  );

  // Structured text functionality
  availableQuestions = input.required<AvailableQuestion[]>();
  properties = input.required<Record<string, PlanProperty>>();
  showRefreshButton = input<boolean>(false);
  
  // Output events
  refreshClicked = output<void>();

  // Add subscription management
  private subscriptions: Subscription[] = [];

  onUserMessage(request: string) {
    this.stepId$.pipe(
      take(1),
      filterNotNullOrUndefined(),
    ).subscribe({
      next: (iterationStepId) => {
        this.store.dispatch(sendMessageToLLMQuestionTranslator({
          question: request,
          iterationStepId: iterationStepId,
        }));
      },
      error: (error) => console.error('Error sending message:', error)
    });
  }

  onEraseHistory() {
    this.store.dispatch(eraseLLMHistory());
  }

  onQuestionSelected(question: AvailableQuestion): void {
    console.log('Question selected:', question);
    this.onUserMessage(question.message.mainText);
  }

  onRefreshSuggestedQuestions(): void {
    this.refreshClicked.emit();
  }

  ngOnInit() {
    this.subscriptions.push(
      this.messages$.subscribe(messages => {
        console.log('Messages:', messages);
      }),
      this.isLoading$.subscribe(loading => {
        console.log('Loading state:', loading);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
