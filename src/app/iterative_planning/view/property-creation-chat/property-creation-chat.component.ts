import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { sendMessageToLLMGoalTranslator } from '../../state/iterative-planning.actions';
import { ChatModule } from 'src/app/shared/components/chat/chat.module';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { selectIsLoading, selectMessages } from './property-creation-chat.component.selector';
import { selectIsExplanationChatLoading, selectIterativePlanningSelectedStep, selectVisiblePPCreationMessages } from '../../state/iterative-planning.selector';
import { createPlanProperty } from '../../state/iterative-planning.actions';
import { MatDialogRef } from '@angular/material/dialog';
import { take, filter, map, mergeMap, switchMap, combineLatestWith } from 'rxjs/operators';
import { selectIterativePlanningProject } from '../../state/iterative-planning.selector';
import { eraseLLMHistory } from '../../state/iterative-planning.actions';
import { selectLLMChatMessages } from '../../state/iterative-planning.selector';
import { combineLatest } from 'rxjs';
import { GoalType, PlanProperty, PlanPropertyBase, PlanPropertyOfProject } from 'src/app/shared/domain/plan-property/plan-property';
import { selectSelectedIterationStepId } from '../../state/iterative-planning.feature';
@Component({
    selector: 'app-property-creation-chat',
    imports: [AsyncPipe, DialogModule, ChatModule],
    templateUrl: './property-creation-chat.component.html',
    styleUrl: './property-creation-chat.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyCreationChatComponent {
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef)

  messages$ = this.store.select(selectVisiblePPCreationMessages);
  isLoading$ = this.store.select(selectIsLoading);
  isExplanationChatLoading$ = this.store.select(selectIsExplanationChatLoading);
  step$ = this.store.select(selectIterativePlanningSelectedStep);
  stepId$ = this.step$.pipe(map(step => step?._id));

  isAnyLoading$ = combineLatest([this.isLoading$, this.isExplanationChatLoading$]).pipe(
    map(([isLoading, isExplanationChatLoading]) => isLoading || isExplanationChatLoading)
  );
  project$ = this.store.select(selectIterativePlanningProject);


  // onUserMessage(request: string) {
  //   this.store.dispatch(sendMessageToLLM({ request }))
  // }

  onUserMessage(request: string) {
    console.log('onUserMessage called with request:', request);
    
    this.stepId$.pipe(
      take(1),
      filter((id): id is string => id !== null && id !== undefined),
    ).subscribe({
      next: (iterationStepId) => {
        console.log('Valid iterationStepId found:', iterationStepId);
        try {
          console.log('Dispatching action with:', { goalDescription: request, iterationStepId });
          this.store.dispatch(sendMessageToLLMGoalTranslator({
            goalDescription: request,
            iterationStepId
          }));
          console.log('Action dispatched successfully');
        } catch (error) {
          console.error('Error dispatching action:', error);
        }
      },
      error: (error) => console.error('Error in stepId$ subscription:', error),
      complete: () => console.log('stepId$ observable completed without emitting a valid ID')
    });
    
    // Debug if the filter might be removing all values
    this.stepId$.pipe(take(1)).subscribe(id => {
      console.log('Raw stepId value before filtering:', id);
      if (id === null || id === undefined) {
        console.warn('stepId is null or undefined, message will not be sent');
      }
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
      if(project === undefined){
        return;
      }

      const planProperty: PlanPropertyOfProject = {
        name: shortName, 
        project: project._id,
        type: GoalType.LTL,
        definition: null,
        naturalLanguageDescription: naturalLanguage,
        formula: formula,
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
