import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { sendMessageToLLM, sendMessageToLLMAllTranslators, sendMessageToLLMGoalTranslator } from 'src/app/LLM/state/llm.actions';
import { ChatModule } from 'src/app/shared/component/chat/chat.module';
import { DialogModule } from 'src/app/shared/component/dialog/dialog.module';
import { selectMessages, selectLoadingState, selectThreadIdET, selectThreadIdGT, selectThreadIdQT } from 'src/app/LLM/state/llm.selector';
import { createPlanProperty } from '../../state/iterative-planning.actions';
import { MatDialogRef } from '@angular/material/dialog';
import { GoalType, PlanProperty } from '../../domain/plan-property/plan-property';
import { take, filter, map, mergeMap, combineLatestWith } from 'rxjs/operators';
import { selectIterativePlanningProject } from '../../state/iterative-planning.selector';
import { eraseLLMHistory } from 'src/app/LLM/state/llm.actions';
@Component({
  selector: 'app-explanation-chat-llm',
  standalone: true,
  imports: [AsyncPipe, DialogModule, ChatModule],
  templateUrl: './explanation-chat-llm.component.html',
  styleUrl: './explanation-chat-llm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplanationChatLlmComponent {
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef)

  messages$ = this.store.select(selectMessages);
  loadingState$ = this.store.select(selectLoadingState);
  threadIdGT$ = this.store.select(selectThreadIdGT);
  threadIdQT$ = this.store.select(selectThreadIdQT);
  threadIdET$ = this.store.select(selectThreadIdET);
  project$ = this.store.select(selectIterativePlanningProject);

  

  onUserMessage(request: string) {
    // Combine all thread IDs and take the first emission from each
    this.threadIdGT$.pipe(
      take(1),
      combineLatestWith(
        this.threadIdQT$.pipe(take(1)),
        this.threadIdET$.pipe(take(1))
      )  // Remove array syntax, use direct parameters
    ).subscribe({
      next: ([threadIdGt, threadIdQt, threadIdEt]) => {
        this.store.dispatch(sendMessageToLLMAllTranslators({
          qtRequest: request,
          gtRequest: request,
          etRequest: request,
          threadIdQt,
          threadIdGt,
          threadIdEt
        }));
      },
      error: (error) => console.error('Error sending message:', error)
    });
  }

  onSaveProperty() {
    this.messages$.pipe(
      take(1),
      filter(messages => messages.length > 0),
      map(messages => {
        const lastAIMessage = messages[messages.length - 1];
        const lastUserMessage = messages[messages.length - 2];
        return { formula: lastAIMessage.content, naturalLanguage: lastUserMessage?.content };
      }),
      // Combine with the project$ observable
      mergeMap(({ formula, naturalLanguage }) => 
        this.project$.pipe(
          take(1),
          map(project => ({ formula, naturalLanguage, project }))
        )
      )
    ).subscribe(({ formula, naturalLanguage, project }) => {
      const planProperty: PlanProperty = {
        name: 'New Property',
        type: GoalType.LTL,
        naturalLanguage: naturalLanguage,
        naturalLanguageDescription: naturalLanguage,
        formula: formula,
        project: project._id, 
        isUsed: true,
        globalHardGoal: false,
        utility: 1,
        color: '#FFB6C1', // Light pink color
        icon: 'chat',
        class: 'Defined using Natural Language',
      }
      this.store.dispatch(createPlanProperty({ planProperty }));
      this.dialogRef.close();
    });
  }

  onEraseHistory() {
    this.store.dispatch(eraseLLMHistory());
  }
}
