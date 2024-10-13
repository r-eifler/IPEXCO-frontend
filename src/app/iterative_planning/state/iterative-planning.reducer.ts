import { createReducer, on } from "@ngrx/store";
import { map } from "ramda";
import { Project } from "src/app/project/domain/project";
import {
    Loadable,
    LoadingState,
} from "src/app/shared/common/loadable.interface";
import { explanationHash } from "../domain/explanation/explanation-hash";
import { GlobalExplanation, QuestionType } from "../domain/explanation/explanations";
import { questionFactory } from "../domain/explanation/question-factory";
import { ExplanationMessage } from "../domain/interface/explanation-message";
import {
    IterationStep,
    ModIterationStep,
    StepStatus,
} from "../domain/iteration_step";
import { PlanProperty } from "../domain/plan-property/plan-property";
import {
    cancelNewIterationStep,
    createIterationStepSuccess,
    deselectIterationStep,
    initNewIterationStep,
    loadIterationSteps,
    loadIterationStepsSuccess,
    loadPlanProperties,
    loadPlanPropertiesSuccess,
    loadProject,
    loadProjectSuccess,
    poseAnswer,
    questionPosed,
    selectIterationStep,
    updateNewIterationStep,
} from "./iterative-planning.actions";

export type Message = (Omit<ExplanationMessage, 'message'> & {message?: string});

export interface IterativePlanningState {
  explanations: {hash: string, explanation: GlobalExplanation | undefined}[];
  iterationSteps: Loadable<IterationStep[]>;
  messages: Message[];
  newStep: undefined | ModIterationStep;
  planProperties: Loadable<Record<string, PlanProperty>>;
  project: Loadable<Project>;
  propertyAvailableQuestionTypes: QuestionType[];
  selectedIterationStepId: undefined | string;
  stepAvailableQuestionTypes: QuestionType[];
}

export const iterativePlanningFeature = "iterative-planning";

const initialState: IterativePlanningState = {
  explanations: [],
  iterationSteps: { state: LoadingState.Initial, data: undefined },
  messages: [],
  newStep: undefined,
  planProperties: { state: LoadingState.Initial, data: undefined },
  project: { state: LoadingState.Initial, data: undefined },
  propertyAvailableQuestionTypes: [QuestionType.CAN_PROPERTY, QuestionType.WHAT_IF_PROPERTY, QuestionType.WHY_NOT_PROPERTY, QuestionType.HOW_PROPERTY],
  selectedIterationStepId: undefined,
  stepAvailableQuestionTypes: [QuestionType.HOW_PLAN, QuestionType.WHY_PLAN],
};

export const iterativePlanningReducer = createReducer(
  initialState,
  on(
    loadProject,
    (state): IterativePlanningState => ({
      ...state,
      project: { state: LoadingState.Loading, data: undefined },
    })
  ),
  on(
    loadProjectSuccess,
    (state, { project }): IterativePlanningState => ({
      ...state,
      project: { state: LoadingState.Done, data: project },
    })
  ),
  on(
    loadPlanProperties,
    (state): IterativePlanningState => ({
      ...state,
      planProperties: {
        state: LoadingState.Loading,
        data: state.planProperties.data,
      },
    })
  ),
  on(
    loadPlanPropertiesSuccess,
    (state, { planProperties }): IterativePlanningState => ({
      ...state,
      planProperties: { state: LoadingState.Done, data: planProperties },
      newStep:
        state.iterationSteps.state == LoadingState.Done &&
          state.iterationSteps.data.length == 0
          ? initFirstNewIterationStep(state)
          : state.newStep,
    })
  ),
  on(
    loadIterationSteps,
    (state): IterativePlanningState => ({
      ...state,
      iterationSteps: {
        state: LoadingState.Loading,
        data: state.iterationSteps.data,
      },
    })
  ),
  on(
    loadIterationStepsSuccess,
    (state, { iterationSteps }): IterativePlanningState => ({
      ...state,
      iterationSteps: { state: LoadingState.Done, data: iterationSteps },
      newStep:
        iterationSteps.length == 0 &&
          state.planProperties.state == LoadingState.Done
          ? initFirstNewIterationStep(state)
          : undefined,
      explanations: extractExplanations(iterationSteps),
    })
  ),
  on(
    createIterationStepSuccess,
    (state): IterativePlanningState => ({
      ...state,
      newStep: undefined,
    })
  ),
  on(initNewIterationStep, (state, { baseStepId }): IterativePlanningState => {
    const baseStep = state.iterationSteps.data?.find(
      ({ _id }) => _id === baseStepId
    );

    return {
      ...state,
      newStep: {
        _id: undefined,
        name: undefined,
        baseStep: baseStepId,
        task: state.project.data?.baseTask,
        status: StepStatus.unknown,
        project: state.project.data._id,
        hardGoals: [...(baseStep?.hardGoals ?? [])],
        softGoals: [...(baseStep?.softGoals ?? [])],
        predecessorStep: baseStepId,
        explanations: [],
      },
    };
  }),
  on(
    updateNewIterationStep,
    (state, { iterationStep }): IterativePlanningState => {
      if (!state.newStep) {
        return state;
      }

      return {
        ...state,
        newStep: {
          ...state.newStep,
          ...iterationStep,
        },
      };
    }
  ),
  on(
    cancelNewIterationStep,
    (state): IterativePlanningState => ({
      ...state,
      newStep: undefined,
    })
  ),
  on(
    selectIterationStep,
    (state, { iterationStepId }): IterativePlanningState => ({
      ...state,
      selectedIterationStepId: iterationStepId,
    })
  ),
  on(
    deselectIterationStep,
    (state): IterativePlanningState => ({
      ...state,
      selectedIterationStepId: undefined,
    })
  ),

  on(questionPosed, (state, {iterationStepId, questionType, propertyId}): IterativePlanningState => ({
    ...state,
    messages: [
      ...state.messages,
      { questionType, iterationStepId, role: 'user', message: questionFactory(questionType)(undefined), propertyId },
    ],
  })),

  on(poseAnswer, (state, { iterationStepId, questionType, propertyId, }): IterativePlanningState => ({
    ...state,
    messages: [
      ...state.messages,
      { questionType, iterationStepId, role: 'system', message: questionFactory(questionType)(undefined), propertyId },
    ],
  }))
);

function initFirstNewIterationStep(
  state: IterativePlanningState
): ModIterationStep {
  return {
    _id: undefined,
    name: "Iteration Step 1",
    baseStep: null,
    task: state.project.data.baseTask,
    status: StepStatus.unknown,
    project: state.project.data._id,
    hardGoals: Object.values(state.planProperties.data)
      .filter((p) => p.globalHardGoal)
      .map((p) => p._id),
    softGoals: [],
    predecessorStep: undefined,
    explanations: [],
  };
}

function extractExplanations(iterationSteps: IterationStep[]): {hash: string, explanation: GlobalExplanation | undefined}[] {
  return map(extractExplanation, iterationSteps);
}

function extractExplanation(iterationStep: IterationStep): {hash: string, explanation: GlobalExplanation | undefined} {
  const hash = explanationHash(iterationStep);

  return {
    hash,
    explanation: iterationStep.globalExplanation,
  }
}
