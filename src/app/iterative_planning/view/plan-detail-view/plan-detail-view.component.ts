import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, combineLatest, filter, map, switchMap, take } from "rxjs";

import { BreadcrumbModule } from "src/app/shared/components/breadcrumb/breadcrumb.module";
import { EmptyStateModule } from "src/app/shared/components/empty-state/empty-state.module";
import { PageModule } from "src/app/shared/components/page/page.module";

import {
    filter as rFilter,
    includes as rIncludes,
    map as rMap,
    not as rNot,
} from "ramda";
import { AvailableQuestion, ExplanationChatComponent } from "../../components/explanation-chat/explanation-chat.component";
import { ExplanationChatLlmComponent } from "../../components/explanation-chat-llm/explanation-chat-llm.component";
import { IterationStepHeroComponent } from "../../components/iteration-step-hero/iteration-step-hero.component";
import { PlanPropertyPanelComponent } from "../../../shared/components/plan-property-panel/plan-property-panel.component";
import { QuestionPanelComponent } from "../../components/question-panel/question-panel.component";
import { explanationHash } from "../../domain/explanation/explanation-hash";
import { QuestionType } from "../../domain/explanation/explanations";
import { questionFactory } from "../../domain/explanation/question-factory";
import { StructuredText } from "../../domain/interface/explanation-message";
import { PlanRunStatus } from "../../domain/plan";
import { PlanProperty } from "../../../shared/domain/plan-property/plan-property";
import { initNewIterationStep, questionPosed } from "../../state/iterative-planning.actions";
import { Message } from "../../state/iterative-planning.reducer";
import {
    selectIsExplanationLoading,
    selectIterativePlanningProjectExplanationInterfaceType,
    selectIterativePlanningProperties,
    selectIterativePlanningSelectedStep,
    selectMessageTypes,
    selectMessages,
    selectPropertyAvailableQuestions,
    selectStepAvailableQuestions,
} from "../../state/iterative-planning.selector";
import {
    selectEnforcedGoals,
    selectSatisfiedSoftGoals,
    selectUnsatisfiedSoftGoals,
} from "./plan-detail-view.component.selector";
import { ExplanationInterfaceType } from "src/app/project/domain/general-settings";
import { MugsVisualizationBaseComponent } from "../visualization/mugs-visualization-base/mugs-visualization-base.component";
import { PlanViewComponent } from "../../components/plan/plan-view/plan-view.component";

@Component({
  selector: "app-plan-detail-view",
  standalone: true,
  imports: [
    AsyncPipe,
    BreadcrumbModule,
    EmptyStateModule,
    ExplanationChatComponent,
    ExplanationChatLlmComponent,
    IterationStepHeroComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PageModule,
    PlanPropertyPanelComponent,
    QuestionPanelComponent,
    RouterLink,
    MugsVisualizationBaseComponent,
    PlanViewComponent
  ],
  templateUrl: "./plan-detail-view.component.html",
  styleUrl: "./plan-detail-view.component.scss",
})
export class PlanDetailViewComponent {
  private store = inject(Store);

  explanationInterfaceType$ = this.store.select(selectIterativePlanningProjectExplanationInterfaceType);
  expInterfaceType = ExplanationInterfaceType

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

  propertyMessages$(property: PlanProperty): Observable<Message[]> {
    return this.stepId$.pipe(
      switchMap(stepId => this.store.select(selectMessages(stepId, property._id))),
    );
  }


  createNewIteration(baseStepId?: string) {
    this.store.dispatch(initNewIterationStep({ baseStepId }));
  }

  onPropertyQuestionSelected(question: AvailableQuestion, property: PlanProperty): void {
    this.stepId$.pipe(take(1)).subscribe((iterationStepId) =>{
      console.log('onPropertyQuestionSelected');
      return this.store.dispatch(questionPosed({ question: { questionType: question.questionType, iterationStepId, propertyId: property._id }}))
    });
  }

  onQuestionSelected(question: AvailableQuestion): void {
    this.stepId$.pipe(take(1)).subscribe((iterationStepId) =>{
      console.log('onPropertyQuestionSelected');
      return this.store.dispatch(questionPosed({ question: { questionType: question.questionType, iterationStepId }}))
    });
  }
}
