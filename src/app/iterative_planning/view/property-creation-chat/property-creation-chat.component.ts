import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { sendMessageToLLMGoalTranslator } from '../../state/iterative-planning.actions';
import { ChatModule } from 'src/app/shared/component/chat/chat.module';
import { DialogModule } from 'src/app/shared/component/dialog/dialog.module';
import { selectIsLoading, selectMessages } from './property-creation-chat.component.selector';
import { selectLLMThreadIdGT } from '../../state/iterative-planning.selector';
import { createPlanProperty } from '../../state/iterative-planning.actions';
import { MatDialogRef } from '@angular/material/dialog';
import { GoalType, PlanProperty } from '../../domain/plan-property/plan-property';
import { take, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { selectIterativePlanningProject } from '../../state/iterative-planning.selector';
import { eraseLLMHistory } from '../../state/iterative-planning.actions';
import { selectLLMChatMessages } from '../../state/iterative-planning.selector';
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
  private dialogRef = inject(MatDialogRef)

  messages$ = this.store.select(selectVisiblePPCreationMessages);
  isLoading$ = this.store.select(selectIsLoading);
  threadIdGT$ = this.store.select(selectLLMThreadIdGT);
  project$ = this.store.select(selectIterativePlanningProject);


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
        return { formula, shortName, naturalLanguage: lastUserMessage?.content };
      }),
      // Combine with the project$ observable
      mergeMap(({ formula, shortName, naturalLanguage }) => 
        this.project$.pipe(
          take(1),
          map(project => ({ formula, shortName, naturalLanguage, project }))
        )
      )
    ).subscribe(({ formula, shortName, naturalLanguage, project }) => {
      const planProperty: PlanProperty = {
        name: shortName, 
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
