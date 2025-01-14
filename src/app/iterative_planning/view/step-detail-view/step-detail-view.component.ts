import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
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
import { cancelPlanComputationAndIterationStep, deleteIterationStep, initNewIterationStep, questionPosed } from "../../state/iterative-planning.actions";
import { Message } from "../../state/iterative-planning.reducer";
import {
    selectIsExplanationLoading,
    selectIterativePlanningIsIntroTask,
    selectIterativePlanningLoadingFinished,
    selectIterativePlanningMaxPossibleUtility,
    selectIterativePlanningProject,
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
} from "./step-detail-view.component.selector";
import { ExplanationInterfaceType } from "src/app/project/domain/general-settings";
import { MatDialog } from "@angular/material/dialog";
import { AskDeleteComponent } from "src/app/shared/components/ask-delete/ask-delete.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { ProjectDirective } from "../../derectives/isProject.directive";
import { UserManualDialogComponent } from "../../components/user-manual-dialog/user-manual-dialog.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DemoDirective } from "../../derectives/isDemo.directive";

@Component({
    selector: "app-step-detail-view",
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
        RouterLink,
        MatExpansionModule,
        ProjectDirective,
        DemoDirective,
        MatProgressBarModule
    ],
    templateUrl: "./step-detail-view.component.html",
    styleUrl: "./step-detail-view.component.scss"
})
export class StepDetailViewComponent {

  host = window.location.protocol + "//" + window.location.host;

  private store = inject(Store);

  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);

  explanationInterfaceType$ = this.store.select(selectIterativePlanningProjectExplanationInterfaceType);
  expInterfaceType = ExplanationInterfaceType;
  isIntroTask$ = this.store.select(selectIterativePlanningIsIntroTask);

  anabelCreationInterface = this.store.select(selectIterativePlanningLoadingFinished);

  project$ = this.store.select(selectIterativePlanningProject);
  maxOverAllUtility$ = this.store.select(selectIterativePlanningMaxPossibleUtility);
  image$ = this.project$.pipe(map(p => p?.summaryImage));
  domainInfo$ = this.project$.pipe(map(p => p?.domainInfo));
  instanceInfo$ = this.project$.pipe(map(p => p?.instanceInfo));

  step$ = this.store.select(selectIterativePlanningSelectedStep);
  stepId$ = this.step$.pipe(map(step => step?._id));
  isUnsolvable$ = this.step$.pipe(
    filter((step) => !!step),
    map((step) => step.plan?.status == PlanRunStatus.not_solvable)
  );
  isCanceled$ = this.step$.pipe(
    filter((step) => !!step),
    map((step) => step.plan?.status == PlanRunStatus.canceled)
  );
  planComputationRunning$ = this.step$.pipe(
    filter((step) => !!step),
    map((step) => step.plan?.status == PlanRunStatus.pending || step.plan?.status == PlanRunStatus.running)
  );
  isFailed$ = this.step$.pipe(
    filter((step) => !!step),
    map((step) => step.plan?.status == PlanRunStatus.failed)
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

  deleteIteration(id?: string) {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {name: "Delete Iteration", text: "Are you sure you want to delete the current iteration?"},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.store.dispatch(deleteIterationStep({ id }));
        this.router.navigate([".."], {relativeTo: this.route});
      }
    });

  }

  onPropertyQuestionSelected(question: AvailableQuestion, property: PlanProperty): void {
    this.stepId$.pipe(take(1)).subscribe((iterationStepId) =>{
      return this.store.dispatch(questionPosed({ question: { questionType: question.questionType, iterationStepId, propertyId: property._id }}))
    });
  }

  onQuestionSelected(question: AvailableQuestion): void {
    this.stepId$.pipe(take(1)).subscribe((iterationStepId) =>{
      return this.store.dispatch(questionPosed({ question: { questionType: question.questionType, iterationStepId }}))
    });
  }


  onHelp(){
    this.dialog.open(UserManualDialogComponent);
  }

  onCancel(){
    this.stepId$.pipe(take(1)).subscribe(id => 
      this.store.dispatch(cancelPlanComputationAndIterationStep({iterationStepId: id}))
    );
  }
}
