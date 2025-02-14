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
import { ExplanationInterfaceType } from "src/app/project/domain/general-settings";
import { filterNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";
import { PlanProperty } from "../../../shared/domain/plan-property/plan-property";
import { AvailableQuestion } from "../../components/explanation-chat/explanation-chat.component";
import { PlanViewComponent } from "../../components/plan/plan-view/plan-view.component";
import { explanationHash } from "../../domain/explanation/explanation-hash";
import { QuestionType } from "../../domain/explanation/explanations";
import { questionFactory } from "../../domain/explanation/question-factory";
import { StructuredText } from "../../domain/interface/explanation-message";
import { PlanRunStatus } from "../../domain/plan";
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

@Component({
    selector: "app-plan-detail-view",
    imports: [
        AsyncPipe,
        BreadcrumbModule,
        EmptyStateModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        PageModule,
        RouterLink,
        PlanViewComponent
    ],
    templateUrl: "./plan-detail-view.component.html",
    styleUrl: "./plan-detail-view.component.scss"
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

  createNewIteration(baseStepId?: string) {
    this.store.dispatch(initNewIterationStep({ baseStepId }));
  }


}
