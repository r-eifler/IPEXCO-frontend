import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { sendMessageToLLMQTthenGTTranslators } from '../../state/iterative-planning.actions';
import { ChatModule } from 'src/app/shared/components/chat/chat.module';
import { selectMessages, selectLLMThreadIdET, selectLLMThreadIdGT, selectLLMThreadIdQT, selectIterativePlanningSelectedStep, selectLLMChatMessages, selectIterativePlanningSelectedStepId, selectVisibleMessagesbyId, selectIsExplanationChatLoading } from '../../state/iterative-planning.selector';
import { createPlanProperty } from '../../state/iterative-planning.actions';
import { take, filter, map, mergeMap, combineLatestWith, switchMap } from 'rxjs/operators';
import { selectIterativePlanningProject } from '../../state/iterative-planning.selector';
import { eraseLLMHistory } from '../../state/iterative-planning.actions';
import { selectIsLLMChatLoading } from '../../state/iterative-planning.selector';
import { combineLatest, Subscription } from 'rxjs';
@Component({
    selector: 'app-explanation-chat-llm',
    imports: [AsyncPipe, ChatModule],
    templateUrl: './explanation-chat-llm.component.html',
    styleUrl: './explanation-chat-llm.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplanationChatLlmComponent implements OnInit, OnDestroy {
  private store = inject(Store);

  
  loadingState$ = this.store.select(selectIsLLMChatLoading);
  isLoading$ = this.store.select(selectIsLLMChatLoading);
  isExplanationChatLoading$ = this.store.select(selectIsExplanationChatLoading);
  isAnyLoading$ = combineLatest([this.isLoading$, this.isExplanationChatLoading$]).pipe(
    map(([isLoading, isExplanationChatLoading]) => isLoading || isExplanationChatLoading)
  );
  threadIdGT$ = this.store.select(selectLLMThreadIdGT);
  threadIdQT$ = this.store.select(selectLLMThreadIdQT);
  threadIdET$ = this.store.select(selectLLMThreadIdET);
  project$ = this.store.select(selectIterativePlanningProject);
  step$ = this.store.select(selectIterativePlanningSelectedStep);
  stepId$ = this.step$.pipe(map(step => step?._id));
  messages$ = this.stepId$.pipe(switchMap(id => this.store.select(selectVisibleMessagesbyId(id))));

  // Add subscription management
  private subscriptions: Subscription[] = [];

  onUserMessage(request: string) {
    this.stepId$.pipe(
      take(1),
    ).subscribe({
      next: (iterationStepId) => {
        this.store.dispatch(sendMessageToLLMQTthenGTTranslators({
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

  ngOnInit() {
    console.log('ExplanationChatLlmComponent initialized');  // Updated log message
    
    // Store subscriptions for cleanup
    this.subscriptions.push(
      this.messages$.subscribe(messages => {
        console.log('Messages:', messages);
      }),
      
      this.isLoading$.subscribe(loading => {
        console.log('Loading state:', loading);
      })
    );
  }

  // Add ngOnDestroy
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('ExplanationChatLlmComponent destroyed');  // Debug cleanup
  }
}
