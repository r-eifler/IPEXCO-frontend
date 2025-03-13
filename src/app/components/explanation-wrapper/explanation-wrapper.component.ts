import {Component, inject, input} from '@angular/core';
import {
  selectIsExplanationLoading,
  selectIterativePlanningProjectExplanationInterfaceType,
  selectIterativePlanningSelectedStep,
  selectMessages,
  selectMessageTypes,
  selectPropertyAvailableQuestions,
  selectStepAvailableQuestions
} from '../../iterative_planning/state/iterative-planning.selector';
import {Store} from '@ngrx/store';
import {ExplanationInterfaceType} from '../../project/domain/general-settings';
import {QuestionFormComponent} from '../question-form/question-form.component';
import {UserStudyMugsVisualizationComponent} from '../visualization/user-study-mugs-visualization/user-study-mugs-visualization.component';
import {PageComponent} from '../../shared/components/page/page/page.component';
import {PageSectionComponent} from '../../shared/components/page/page-section/page-section.component';
import {AsyncPipe} from '@angular/common';
import {PageSectionContentComponent} from '../../shared/components/page/page-section-content/page-section-content.component';
import {PageContentComponent} from '../../shared/components/page/page-content/page-content.component';
import {combineLatest, filter, map, Observable, switchMap, take} from 'rxjs';
import {QuestionType} from '../../iterative_planning/domain/explanation/explanations';
import {
  filter as rFilter,
  includes as rIncludes,
  map as rMap,
  not as rNot
} from 'ramda';
import {questionFactory} from '../../iterative_planning/domain/explanation/question-factory';
import {explanationHash} from '../../iterative_planning/domain/explanation/explanation-hash';
import {AvailableQuestion} from '../../iterative_planning/components/explanation-chat/explanation-chat.component';
import {questionPosed} from '../../iterative_planning/state/iterative-planning.actions';
import {PlanProperty} from '../../shared/domain/plan-property/plan-property';
import {StructuredText} from '../../iterative_planning/domain/interface/explanation-message';
import {Message} from '../../iterative_planning/state/iterative-planning.reducer';


@Component({
  selector: 'app-explanation-wrapper',
  templateUrl: './explanation-wrapper.component.html',
  styleUrls: ['./explanation-wrapper.component.scss'],
  imports: [
    QuestionFormComponent,
    UserStudyMugsVisualizationComponent,
    AsyncPipe
  ],
  standalone: true
})


export class ExplanationWrapperComponent {
  private store = inject(Store);

  isUnsolvable = input.required<boolean>();
  property = input.required<PlanProperty>();

  explanationInterfaceType$ = this.store.select(selectIterativePlanningProjectExplanationInterfaceType);
  step$ = this.store.select(selectIterativePlanningSelectedStep);
  stepId$ = this.step$.pipe(map(step => step?._id));

  isExplanationLoading$ = this.step$.pipe(
    map(explanationHash),
    switchMap(hash => this.store.select(selectIsExplanationLoading(hash)))
  );

  globalMessages$ = this.stepId$.pipe(
    switchMap(stepId => this.store.select(selectMessages(stepId))));

  propertyMessages$(property: PlanProperty): Observable<Message[]> {
    return this.stepId$.pipe(
      switchMap(stepId => this.store.select(selectMessages(stepId, property._id))),
    );
  }

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

  onPropertyQuestionSelected(question: AvailableQuestion, property: PlanProperty): void {
    this.stepId$.pipe(take(1)).subscribe((iterationStepId) =>{
      return this.store.dispatch(questionPosed({ question: { questionType: question.questionType, iterationStepId, propertyId: property._id }}))
    });
  }

  propertyAvailableQuestionTypes$(property: PlanProperty): Observable<{questionType: QuestionType, message: StructuredText}[]> {
    return this.step$.pipe(
      map((step) => step?._id),
      filter((id) => !!id),
      switchMap((stepId) =>
        combineLatest([
          this.store.select(selectPropertyAvailableQuestions),
          this.store.select(selectMessageTypes(stepId, property._id)),
        ]).pipe(
          map(([allQuestionTypes, alreadyAskedQuestionTypes]) => {
            const notAlreadyAskedFn = (type: QuestionType) => rNot(rIncludes(type, alreadyAskedQuestionTypes));
            return rFilter(notAlreadyAskedFn, allQuestionTypes);
          }),
          map(questionTypes => rMap((questionType) => ({ questionType, message: questionFactory(questionType)(property.name)}), questionTypes)),
        )
      )
    );
  }

  protected readonly ExplanationInterfaceType = ExplanationInterfaceType;

}
