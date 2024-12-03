import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, output } from '@angular/core';
import { Store } from '@ngrx/store';
import { sendMessageToLLMGoalTranslator } from '../../state/iterative-planning.actions';
import { ChatModule } from 'src/app/shared/component/chat/chat.module';
import { DialogModule } from 'src/app/shared/component/dialog/dialog.module';
import { selectIsLoading, selectMessages } from './property-creation-chat.component.selector';
import { selectIsExplanationChatLoading, selectLLMThreadIdGT, selectVisiblePPCreationMessages } from '../../state/iterative-planning.selector';
import { createPlanProperty } from '../../state/iterative-planning.actions';
import { MatDialogRef } from '@angular/material/dialog';
import { take, filter, map, mergeMap, switchMap, combineLatestWith } from 'rxjs/operators';
import { selectIterativePlanningProject } from '../../state/iterative-planning.selector';
import { eraseLLMHistory } from '../../state/iterative-planning.actions';
import { selectLLMChatMessages } from '../../state/iterative-planning.selector';
import { combineLatest } from 'rxjs';
import { GoalType, PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';


@Component({
  selector: 'app-property-creation-chat',
  standalone: true,
  imports: [AsyncPipe, DialogModule, ChatModule],
  templateUrl: './property-creation-chat.component.html',
  styleUrl: './property-creation-chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyCreationChatComponent {
  private store = inject(Store);

  cancel = output<void>();
  created = output<PlanProperty>();

  messages$ = this.store.select(selectVisiblePPCreationMessages);
  isLoading$ = this.store.select(selectIsLoading);
  isExplanationChatLoading$ = this.store.select(selectIsExplanationChatLoading);

  isAnyLoading$ = combineLatest([this.isLoading$, this.isExplanationChatLoading$]).pipe(
    map(([isLoading, isExplanationChatLoading]) => isLoading || isExplanationChatLoading)
  );
  threadIdGT$ = this.store.select(selectLLMThreadIdGT);


  // onUserMessage(request: string) {
  //   this.store.dispatch(sendMessageToLLM({ request }))
  // }

  onUserMessage(request: string) {
    this.threadIdGT$.pipe(take(1)).subscribe(threadId => {
      this.store.dispatch(sendMessageToLLMGoalTranslator({goalDescription: request}));
    });
  }

  onSaveProperty() {
    this.messages$.pipe(
      take(1),
      filter(messages => messages.length > 0),
      map(messages => {
        const lastAIMessage = messages[messages.length - 1];
        const [formula, shortName] = lastAIMessage.content.split(';').map(s => s.trim());
        const lastUserMessage = messages[messages.length - 2];
        const naturalLanguage = lastUserMessage?.content;

        const planProperty: PlanProperty = {
          name: shortName, 
          type: GoalType.LTL,
          naturalLanguage: naturalLanguage,
          naturalLanguageDescription: naturalLanguage,
          formula: formula,
          project: null, 
          isUsed: true,
          globalHardGoal: false,
          utility: 1,
          color: '#FFB6C1', // Light pink color
          icon: 'chat',
          class: 'Defined using Natural Language',
        }

        this.created.emit(planProperty);
      }));
  }

  onEraseHistory() {
    this.store.dispatch(eraseLLMHistory());
  }

  onCancel(){
	  this.cancel.emit()
  }
}
