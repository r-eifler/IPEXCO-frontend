import {Component, inject, input} from '@angular/core';
import {
  selectExplanation,
  selectIsExplanationLoading,
  selectIterativePlanningProjectExplanationInterfaceType,
  selectIterativePlanningProperties,
  selectIterativePlanningSelectedStep,
  selectMessageTypes,
  selectPropertyAvailableQuestions,
  selectStepAvailableQuestions
} from '../../state/iterative-planning.selector';
import {Store} from '@ngrx/store';
import {ExplanationInterfaceType} from '../../../project/domain/general-settings';
import {UserStudyMugsVisualizationComponent} from '../../../components/visualization/user-study-mugs-visualization/user-study-mugs-visualization.component';
import {AsyncPipe, NgIf} from '@angular/common';
import {combineLatest, filter, map, Observable, switchMap, take} from 'rxjs';
import {ExplanationRunStatus, QuestionType} from '../../domain/explanation/explanations';
import {
  filter as rFilter,
  includes as rIncludes,
  map as rMap,
  not as rNot
} from 'ramda';
import {questionFactory} from '../../domain/explanation/question-factory';
import {explanationHash} from '../../domain/explanation/explanation-hash';
import {AvailableQuestion} from '../explanation-chat/explanation-chat.component';
import {PlanProperty} from '../../../shared/domain/plan-property/plan-property';
import {StructuredText} from '../../domain/interface/explanation-message';
import {mapComputeBase} from '../../domain/explanation/answer-factory';
import { QuestionFormComponent } from '../question-form/question-form.component';
import { ConflictListsComponent } from '../conflict-lists/conflict-lists.component';


@Component({
  selector: 'app-explanation-wrapper',
  templateUrl: './explanation-wrapper.component.html',
  styleUrls: ['./explanation-wrapper.component.scss'],
  imports: [
    QuestionFormComponent,
    UserStudyMugsVisualizationComponent,
    AsyncPipe,
    NgIf,
    ConflictListsComponent
  ],
  standalone: true
})


export class ExplanationWrapperComponent {
  private store = inject(Store);

  isUnsolvable = input.required<boolean>();
  property = input.required<PlanProperty>();

  explanationInterfaceType$ = this.store.select(selectIterativePlanningProjectExplanationInterfaceType);
  step$ = this.store.select(selectIterativePlanningSelectedStep);

  planProperties$ = this.store.select(selectIterativePlanningProperties);

  isExplanationLoading$ = this.step$.pipe(
    map(explanationHash),
    switchMap(hash => this.store.select(selectIsExplanationLoading(hash)))
  );

  globalAnswers$: Observable<string[][]> = new Observable();

  answers$(question: AvailableQuestion, property?: PlanProperty | null) {
    this.globalAnswers$ = this.step$.pipe(
      switchMap(iterationStep => {
        const hash = explanationHash(iterationStep);
        return this.store.select(selectExplanation(hash)).pipe(
          filter(explanation =>
            explanation?.status === ExplanationRunStatus.FAILED ||
            explanation?.status === ExplanationRunStatus.FINISHED
          ),
          take(1),
          map(explanation => mapComputeBase(
            iterationStep,
            { iterationStepId: iterationStep._id, propertyId: property?._id, questionType: question.questionType },
            explanation.MUGS
          ))
          //tap(result => console.log('Computed Answer:', result))
        );
      })
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
