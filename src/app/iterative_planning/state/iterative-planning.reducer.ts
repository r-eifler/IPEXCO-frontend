import { createReducer, on } from "@ngrx/store";
import { map, pipe, reduce } from "ramda";
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
    questionPosedLLM,
    selectIterationStep,
    updateNewIterationStep,
} from "./iterative-planning.actions";
import {
  sendMessageToLLM,
  sendMessageToLLMSuccess,
  eraseLLMHistory,
  sendMessageToLLMQuestionTranslator,
  sendMessageToLLMGoalTranslator,
  sendMessageToLLMExplanationTranslator,
  sendMessageToLLMQuestionTranslatorSuccess,
  sendMessageToLLMGoalTranslatorSuccess,
  sendMessageToLLMExplanationTranslatorSuccess,
  sendMessageToLLMExplanationTranslatorFailure,
  sendMessageToLLMQTthenGTTranslators,
  sendMessageToLLMQTthenGTTranslatorsSuccess,
  sendMessageToLLMQTthenGTTranslatorsFailure,
} from "src/app/LLM/state/llm.actions";


type messageType = ExplanationMessage['message'];
export type Message = (Omit<ExplanationMessage, 'message'> & { message?: messageType });

export interface LLMMessage{
  role: 'user' | 'assistant',
  content: string
}

export interface IterativePlanningState {
  explanations: Record<string,GlobalExplanation | undefined>;
  iterationSteps: Loadable<IterationStep[]>;
  messages?: Message[] 
  newStep: undefined | ModIterationStep;
  planProperties: Loadable<Record<string, PlanProperty>>;
  project: Loadable<Project>;
  propertyAvailableQuestionTypes: QuestionType[];
  selectedIterationStepId: undefined | string;
  stepAvailableQuestionTypes: QuestionType[];
  LLMChatLoadingState: LoadingState;
  LLMThreadIdQT: string;
  LLMThreadIdGT: string;
  LLMThreadIdET: string;
  LLMMessages: LLMMessage[];
}

export const iterativePlanningFeature = "iterative-planning";

const initialState: IterativePlanningState = {
  explanations: {},
  iterationSteps: { state: LoadingState.Initial, data: undefined },
  messages: [],
  newStep: undefined,
  planProperties: { state: LoadingState.Initial, data: undefined },
  project: { state: LoadingState.Initial, data: undefined },
  propertyAvailableQuestionTypes: [QuestionType.CAN_PROPERTY, QuestionType.WHAT_IF_PROPERTY, QuestionType.WHY_NOT_PROPERTY, QuestionType.HOW_PROPERTY],
  selectedIterationStepId: undefined,
  stepAvailableQuestionTypes: [QuestionType.HOW_PLAN, QuestionType.WHY_PLAN],
  LLMChatLoadingState: LoadingState.Initial,
  LLMThreadIdQT: '',
  LLMThreadIdGT: '',
  LLMThreadIdET: '',
  LLMMessages: [],
};

export const iterativePlanningReducer = createReducer(
  initialState,
  on(
    loadProject,
    (state): IterativePlanningState => ({
      ...state,
      project: { state: LoadingState.Loading, data: undefined },
      LLMChatLoadingState: LoadingState.Initial,
      LLMMessages: [],
      LLMThreadIdQT: '',
      LLMThreadIdGT: '',
      LLMThreadIdET: ''
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

  on(questionPosed, (state, { question: {iterationStepId, questionType, propertyId } }): IterativePlanningState => ({
    ...state,
    messages: [
      ...state.messages,
      { questionType, iterationStepId, role: 'user', message: questionFactory(questionType)(state.planProperties?.data?.[propertyId]?.name), propertyId },
    ],
  })),

  on(poseAnswer, (state, { answer }): IterativePlanningState => ({
    ...state,
    messages: [
      ...state.messages,
      answer,
    ],
  })),

  // LLM STUFF TO BE UPDATED

  on(sendMessageToLLM, (state, { request }): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Loading,
    LLMMessages: [...state.LLMMessages, { role: 'user', content: request }]
})),
on(sendMessageToLLMSuccess, (state, { response }): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Done,
    LLMMessages: [...state.LLMMessages, { role: 'assistant', content: response }]
})),
on(eraseLLMHistory, (state): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Initial,
    LLMMessages: [],
    LLMThreadIdQT: '',
    LLMThreadIdGT: '',
    LLMThreadIdET: ''
})),
on(sendMessageToLLMQuestionTranslator, (state, action): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Loading,
})),
on(sendMessageToLLMQuestionTranslatorSuccess, (state, action): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Done,
    LLMThreadIdQT: action.threadId
})),
on(sendMessageToLLMGoalTranslator, (state, action): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Loading,
    LLMMessages: [...state.LLMMessages, {role: 'user', content: action.request}]
})),
on(sendMessageToLLMGoalTranslatorSuccess, (state, action): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Done,
    LLMThreadIdGT: action.threadId,
    LLMMessages: [...state.LLMMessages, {role: 'assistant', content: action.response}]
})),
on(sendMessageToLLMExplanationTranslator, (state, action): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Loading,
    LLMThreadIdET: action.threadId
})),
on(sendMessageToLLMExplanationTranslatorSuccess, (state, action): IterativePlanningState => ({
    ...state,
    LLMThreadIdET: action.threadId,
    LLMChatLoadingState: LoadingState.Done,
    LLMMessages: [...state.LLMMessages, {role: 'assistant', content: action.response}]
})),
on(sendMessageToLLMExplanationTranslatorFailure, (state): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Done
})),
on(sendMessageToLLMQTthenGTTranslators, (state, action): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Loading,
    LLMMessages: [...state.LLMMessages, {role: 'user', content: action.request}]
})),
on(sendMessageToLLMQTthenGTTranslatorsSuccess, (state, action): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Done,
    LLMThreadIdQT: action.threadIdQt,
    LLMThreadIdGT: action.threadIdGt,
})),
on(sendMessageToLLMQTthenGTTranslatorsFailure, (state): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Done
})),

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
  };
}

function extractExplanations(iterationSteps: IterationStep[]): Record<string,GlobalExplanation | undefined> {
  return pipe(
    map(extractExplanation),
    reduce((acc, curr) => ({ ...acc, ...curr}), {}),
  )(iterationSteps);
}

function extractExplanation(iterationStep: IterationStep): Record<string,GlobalExplanation | undefined> {
  const hash = explanationHash(iterationStep);

  return {
    [hash]: iterationStep.globalExplanation,
  }
}
