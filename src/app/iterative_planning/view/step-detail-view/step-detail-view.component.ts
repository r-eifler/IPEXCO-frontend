import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { combineLatest, filter, map, switchMap, take } from "rxjs";

import { BreadcrumbModule } from "src/app/shared/component/breadcrumb/breadcrumb.module";
import { EmptyStateModule } from "src/app/shared/component/empty-state/empty-state.module";
import { PageModule } from "src/app/shared/component/page/page.module";

import {
    filter as rFilter,
    includes as rIncludes,
    map as rMap,
    not as rNot,
} from "ramda";
import { AvailableQuestion, ExplanationChatComponent } from "../../components/explanation-chat/explanation-chat.component";
import { IterationStepHeroComponent } from "../../components/iteration-step-hero/iteration-step-hero.component";
import { PlanProeprtyPanelComponent } from "../../components/plan-proeprty-panel/plan-proeprty-panel.component";
import { QuestionPanelComponent } from "../../components/question-panel/question-panel.component";
import { explanationHash } from "../../domain/explanation/explanation-hash";
import { QuestionType } from "../../domain/explanation/explanations";
import { questionFactory } from "../../domain/explanation/question-factory";
import { PlanRunStatus } from "../../domain/plan";
import { initNewIterationStep, questionPosed } from "../../state/iterative-planning.actions";
import {
    selectIsExplanationLoading,
    selectIterativePlanningProperties,
    selectIterativePlanningSelectedStep,
    selectMessageTypes,
    selectMessages,
    selectStepAvailableQuestions,
} from "../../state/iterative-planning.selector";
import {
    selectEnforcedGoals,
    selectSatisfiedSoftGoals,
    selectUnsatisfiedSoftGoals,
} from "./step-detail-view.component.selector";

@Component({
  selector: "app-step-detail-view",
  standalone: true,
  imports: [
    AsyncPipe,
    BreadcrumbModule,
    EmptyStateModule,
    ExplanationChatComponent,
    IterationStepHeroComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PageModule,
    PlanProeprtyPanelComponent,
    QuestionPanelComponent,
    RouterLink,
  ],
  templateUrl: "./step-detail-view.component.html",
  styleUrl: "./step-detail-view.component.scss",
})
export class StepDetailViewComponent {
  private store = inject(Store);

  step$ = this.store.select(selectIterativePlanningSelectedStep);
  stepId$ = this.step$.pipe(map(step => step?._id));
  isUnsolvable$ = this.step$.pipe(
    filter((step) => !!step),
    map((step) => step.plan?.status == PlanRunStatus.not_solvable)
  );
  planProperties$ = this.store.select(selectIterativePlanningProperties);

  enforcedGoals$ = this.store.select(selectEnforcedGoals);
  solvedSoftGoals$ = this.store.select(selectSatisfiedSoftGoals);
  unsolvedSoftGoals$ = this.store.select(selectUnsatisfiedSoftGoals);

  hasEnforcedGoals$ = this.enforcedGoals$.pipe(map((goals) => !!goals?.length));
  hasSolvedSoftGoals$ = this.solvedSoftGoals$.pipe(
    map((goals) => !!goals?.length)
  );
  hasUnsolvedSoftGoals$ = this.unsolvedSoftGoals$.pipe(
    map((goals) => !!goals?.length)
  );

  isExplanationLoading$ = this.step$.pipe(
    map(explanationHash),
    switchMap(hash => this.store.select(selectIsExplanationLoading(hash)))
  );

  globalAvalableQuestionTypes$ = this.step$.pipe(
    map((step) => step?._id),
    filter((id) => !!id),
    switchMap((stepId) =>
      combineLatest([
        this.store.select(selectStepAvailableQuestions),
        this.store.select(selectMessageTypes(stepId)),
      ]).pipe(
        map(([allQuestionTypes, alreadyAskedQuestionTypes]) => {
          const notAlreadyAskedFn = (type: QuestionType) => rNot(rIncludes(type, alreadyAskedQuestionTypes));
          return rFilter(notAlreadyAskedFn, allQuestionTypes);
        }),
        map( rMap((questionType) => ({ questionType, message: questionFactory(questionType)(undefined)  }))),
      )
    )
  );

  globalMessages$ = this.stepId$.pipe(
    switchMap(stepId => this.store.select(selectMessages(stepId))),
  );

  createNewIteration(baseStepId?: string) {
    this.store.dispatch(initNewIterationStep({ baseStepId }));
  }

  onQuestionSelected(question: AvailableQuestion): void {
    this.stepId$.pipe(take(1)).subscribe((iterationStepId) =>
      this.store.dispatch(questionPosed({ question: { questionType: question.questionType, iterationStepId }}))
    );
  }
}
