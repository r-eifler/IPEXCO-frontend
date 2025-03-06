import {Component, inject} from '@angular/core';
import {
  selectIsExplanationLoading,
  selectIterativePlanningProjectExplanationInterfaceType, selectIterativePlanningSelectedStep, selectMessages, selectMessageTypes,
  selectStepAvailableQuestions
} from '../../state/iterative-planning.selector';
import {Store} from '@ngrx/store';
import {ExplanationInterfaceType} from '../../../project/domain/general-settings';
import {QuestionFormComponent} from '../question-form/question-form.component';
import {UserStudyMugsVisualizationComponent} from '../visualization/user-study-mugs-visualization/user-study-mugs-visualization.component';
import {PageComponent} from '../../../shared/components/page/page/page.component';
import {PageSectionComponent} from '../../../shared/components/page/page-section/page-section.component';
import {AsyncPipe} from '@angular/common';
import {PageSectionContentComponent} from '../../../shared/components/page/page-section-content/page-section-content.component';
import {PageContentComponent} from '../../../shared/components/page/page-content/page-content.component';
import {combineLatest, filter, map, switchMap, take} from 'rxjs';
import {QuestionType} from '../../domain/explanation/explanations';
import {
  filter as rFilter,
  includes as rIncludes,
  map as rMap,
  not as rNot
} from 'ramda';
import {questionFactory} from '../../domain/explanation/question-factory';
import {explanationHash} from '../../domain/explanation/explanation-hash';
import {AvailableQuestion} from '../../components/explanation-chat/explanation-chat.component';
import {questionPosed} from '../../state/iterative-planning.actions';
import {ChatMessageComponent} from '../../../shared/components/chat/chat-message/chat-message.component';

@Component({
  selector: 'app-explanation-wrapper',
  templateUrl: './explanation-wrapper.component.html',
  styleUrls: ['./explanation-wrapper.component.scss'],
  imports: [
    QuestionFormComponent,
    UserStudyMugsVisualizationComponent,
    PageComponent,
    PageContentComponent,
    PageSectionComponent,
    PageSectionContentComponent,
    AsyncPipe,
    ChatMessageComponent
  ],
  standalone: true
})

export class ExplanationWrapperComponent {
  private store = inject(Store);

  explanationInterfaceType$ = this.store.select(selectIterativePlanningProjectExplanationInterfaceType);
  step$ = this.store.select(selectIterativePlanningSelectedStep);
  stepId$ = this.step$.pipe(map(step => step?._id));

  isExplanationLoading$ = this.step$.pipe(
    map(explanationHash),
    switchMap(hash => this.store.select(selectIsExplanationLoading(hash)))
  );

  globalMessages$ = this.stepId$.pipe(
    switchMap(stepId => this.store.select(selectMessages(stepId))));

  globalAvalableQuestionTypes$ = this.step$.pipe(
    map((step) => step?._id),
    filter((id) => !!id),
    switchMap((stepId) =>
      combineLatest([
        this.store.select(selectStepAvailableQuestions),
        this.store.select(selectMessageTypes(stepId))
      ]).pipe(
        map(([allQuestionTypes, alreadyAskedQuestionTypes]) => {
          const notAlreadyAskedFn = (type: QuestionType) => rNot(rIncludes(type, alreadyAskedQuestionTypes));
          return rFilter(notAlreadyAskedFn, allQuestionTypes);
        }),
        map( rMap((questionType) => ({ questionType, message: questionFactory(questionType)(undefined)  }))),
      )
    )
  );

  onQuestionSelected(question: AvailableQuestion): void {
    this.stepId$.pipe(take(1)).subscribe((iterationStepId) =>{
      return this.store.dispatch(questionPosed({ question: { questionType: question.questionType, iterationStepId }}))
    });
  }

  protected readonly ExplanationInterfaceType = ExplanationInterfaceType;

}
