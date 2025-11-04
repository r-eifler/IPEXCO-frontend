import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, output, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { filterNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';
import { ChatModule } from 'src/app/shared/components/chat/chat.module';
import { eraseLLMHistory, sendMessageToLLMQuestionTranslator } from '../../state/iterative-planning.actions';
import { selectIsExplanationChatLoading, selectIsLLMChatLoading, selectIsQuestionSuggestionLoading, selectIterativePlanningProject, selectIterativePlanningSelectedStep, selectSuggestedQuestions, selectVisibleMessagesbyId } from '../../state/iterative-planning.selector';
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

  // Suggested questions from store
  suggestedQuestions$ = this.stepId$.pipe(
    filterNotNullOrUndefined(),
    switchMap(id => this.store.select(selectSuggestedQuestions(id))),
    map(questions => questions ?? [])
  );

  // Question suggestion loading state
  isQuestionSuggestionLoading$ = this.stepId$.pipe(
    filterNotNullOrUndefined(),
    switchMap(id => this.store.select(selectIsQuestionSuggestionLoading(id)))
  );

  // Structured text functionality
  availableQuestions = input.required<AvailableQuestion[]>();
  properties = input.required<Record<string, PlanProperty>>();
  showRefreshButton = input<boolean>(false);
  
  // Track suggested questions from store
  private suggestedQuestionsFromStore = signal<string[]>([]);
  
  // Track question suggestion loading state
  isQuestionSuggestionLoading = signal<boolean>(false);
  
  // Track asked questions
  private askedQuestions = signal<Set<string>>(new Set());
  
  // Track whether questions are hidden
  private questionsHidden = signal<boolean>(false);
  
  // Convert suggested questions (strings) to AvailableQuestion format
  private suggestedQuestionsAsAvailable = computed(() => {
    const questions = this.suggestedQuestionsFromStore();
    if (questions.length === 0) {
      return [];
    }
    return questions.map(question => ({
      message: { mainText: question } as StructuredText,
      questionType: QuestionType.DIRECT_USER
    } as AvailableQuestion));
  });
  
  // Use suggested questions if available and non-empty, otherwise use input
  effectiveAvailableQuestions = computed(() => {
    // If loading, return empty array so we can show loading message
    if (this.isQuestionSuggestionLoading()) {
      return [];
    }
    const suggested = this.suggestedQuestionsAsAvailable();
    if (suggested.length > 0 && suggested.length < 4) {
      return suggested;
    }
    return this.availableQuestions();
  });
  
  // Computed property to filter out asked questions
  filteredAvailableQuestions = computed(() => {
    const asked = this.askedQuestions();
    return this.effectiveAvailableQuestions().filter(question => 
      !asked.has(question.message.mainText)
    );
  });
  
  // Computed property to determine if questions should be shown
  shouldShowQuestions = computed(() => !this.questionsHidden());
  
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
    
    // Add the question to the asked questions set
    const currentAsked = this.askedQuestions();
    const newAsked = new Set(currentAsked);
    newAsked.add(question.message.mainText);
    this.askedQuestions.set(newAsked);
    
    this.onUserMessage(question.message.mainText);
  }

  onRefreshSuggestedQuestions(): void {
    // Reset asked questions when refreshing
    this.askedQuestions.set(new Set());
    // Show questions again when refreshing
    this.questionsHidden.set(false);
    this.refreshClicked.emit();
  }

  onToggleQuestionsVisibility(): void {
    this.questionsHidden.set(!this.questionsHidden());
  }

  ngOnInit() {
    this.subscriptions.push(
      this.messages$.subscribe(messages => {
        console.log('Messages:', messages);
      }),
      this.isLoading$.subscribe(loading => {
        console.log('Loading state:', loading);
      }),
      this.suggestedQuestions$.subscribe(questions => {
        this.suggestedQuestionsFromStore.set(questions);
      }),
      this.isQuestionSuggestionLoading$.subscribe(loading => {
        this.isQuestionSuggestionLoading.set(loading);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
