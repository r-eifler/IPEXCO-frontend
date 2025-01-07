import { createReducer, on } from "@ngrx/store";
import { map, pipe, reduce } from "ramda";
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
import { PlanProperty } from "../../shared/domain/plan-property/plan-property";
import {
    cancelNewIterationStep,
    createIterationStepSuccess,
    deselectIterationStep,
    eraseLLMHistory,
    initNewIterationStep,
    loadIterationSteps,
    loadIterationStepsSuccess,
    loadLLMContext,
    loadLLMContextSuccess,
    loadPlanProperties,
    loadPlanPropertiesSuccess,
    loadProject,
    loadProjectSuccess,
    poseAnswer,
    questionPosed,
    questionPosedLLM,
    selectIterationStep,
    sendMessageToLLMExplanationTranslator,
    updateNewIterationStep,
} from "./iterative-planning.actions";
import {
  sendMessageToLLMGoalTranslator,
  sendMessageToLLMGoalTranslatorSuccess,
  sendMessageToLLMExplanationTranslatorSuccess,
  sendMessageToLLMExplanationTranslatorFailure,
  sendMessageToLLMQTthenGTTranslators,
  sendMessageToLLMQTthenGTTranslatorsSuccess,
  sendMessageToLLMQTthenGTTranslatorsFailure,
} from "./iterative-planning.actions";
import { LLMContext } from "src/app/LLM/domain/context";
import { Project } from "src/app/shared/domain/project";

type messageType = ExplanationMessage['message'];
export type Message = (Omit<ExplanationMessage, 'message'> & { message?: messageType });

export interface LLMMessage{
  role: 'sender' | 'receiver',
  content: string
}

export interface IterativePlanningState {
  explanations: Record<string,GlobalExplanation | undefined>;
  iterationSteps: Loadable<IterationStep[]>;
  messages?: Message[] 
  newStep: undefined | ModIterationStep;
  createdStep: undefined | string;
  planProperties: Loadable<Record<string, PlanProperty>>;
  project: Loadable<Project>;
  propertyAvailableQuestionTypes: QuestionType[];
  selectedIterationStepId: undefined | string;
  stepAvailableQuestionTypes: QuestionType[];
  LLMChatLoadingState: LoadingState;
  ExplanationLoadingState: LoadingState;
  LLMContext: LLMContext;

}

export const iterativePlanningFeature = "iterative-planning";

const initialState: IterativePlanningState = {
  explanations: {},
  iterationSteps: { state: LoadingState.Initial, data: undefined },
  messages: [],
  newStep: undefined,
  createdStep: undefined,
  planProperties: { state: LoadingState.Initial, data: undefined },
  project: { state: LoadingState.Initial, data: undefined },
  propertyAvailableQuestionTypes: [QuestionType.CAN_PROPERTY, QuestionType.WHAT_IF_PROPERTY, QuestionType.WHY_NOT_PROPERTY, QuestionType.HOW_PROPERTY],
  selectedIterationStepId: undefined,
  stepAvailableQuestionTypes: [QuestionType.HOW_PLAN, QuestionType.WHY_PLAN],
  LLMChatLoadingState: LoadingState.Initial,
  ExplanationLoadingState: LoadingState.Initial,
  LLMContext: {
    threadIdQT: '',
    threadIdGT: '',
    threadIdET: '',
    visibleMessages: [],
    visiblePPCreationMessages: [],
    seenByGTMessages: [],
    seenByETMessages: [],
    seenByQTMessages: [],
    project: undefined
  },

};

export const iterativePlanningReducer = createReducer(
  initialState,
  on(
    loadProject,
    (state): IterativePlanningState => ({
      ...state,
      project: { state: LoadingState.Loading, data: undefined },
      LLMChatLoadingState: LoadingState.Initial,
      LLMContext: {
        ...initialState.LLMContext,
        project: state.project.data?._id
      }
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
    (state, {iterationStep}): IterativePlanningState => ({
      ...state,
      newStep: undefined,
      createdStep: iterationStep._id
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
      createdStep: undefined
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
    ExplanationLoadingState: LoadingState.Initial,
    messages: [
      ...state.messages,
      { questionType, iterationStepId, role: 'receiver', message: questionFactory(questionType)(state.planProperties?.data?.[propertyId]?.name), propertyId },
    ],
  })),

  on(poseAnswer, (state, { answer }): IterativePlanningState => ({
    ...state,
    ExplanationLoadingState: LoadingState.Initial,
    messages: [
      ...state.messages,
      answer,
    ],
  })),

//   // LLM STUFF TO BE UPDATED

//   on(sendMessageToLLM, (state, { request }): IterativePlanningState => ({
//     ...state,
//     LLMChatLoadingState: LoadingState.Loading,
//     LLMMessages: [...state.LLMMessages, { role: 'sender', content: request }]
// })),
// on(sendMessageToLLMSuccess, (state, { response }): IterativePlanningState => ({
//     ...state,
//     LLMChatLoadingState: LoadingState.Done,
//     LLMMessages: [...state.LLMMessages, { role: 'receiver', content: response }]
// })),
  on(eraseLLMHistory, (state): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Initial,
    LLMContext: {
      ...state.LLMContext,
      visiblePPCreationMessages: [],
      visibleMessages: [],
      threadIdGT: '',
      threadIdQT: '',
      threadIdET: ''
    }
})),
// on(sendMessageToLLMQuestionTranslator, (state, action): IterativePlanningState => ({
//     ...state,
//     LLMChatLoadingState: LoadingState.Loading,
// })),
// on(sendMessageToLLMQuestionTranslatorSuccess, (state, action): IterativePlanningState => ({
//     ...state,
//     LLMChatLoadingState: LoadingState.Done,
//     LLMThreadIdQT: action.threadId
// })),
on(sendMessageToLLMGoalTranslator, (state, action): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Loading,
    LLMContext: {
      ...state.LLMContext,
      visiblePPCreationMessages: [...state.LLMContext.visiblePPCreationMessages, {role: 'receiver', content: action.goalDescription, iterationStepId: state.selectedIterationStepId}]
    }
})),
on(sendMessageToLLMGoalTranslatorSuccess, (state, action): IterativePlanningState => ({
  ...state,
  LLMChatLoadingState: LoadingState.Done,
    LLMContext: {
      ...state.LLMContext,
      threadIdGT: action.threadId,
      visiblePPCreationMessages: [...state.LLMContext.visiblePPCreationMessages, { role: 'sender', content: `${action.response.formula} ; ${action.response.shortName}`, iterationStepId: state.selectedIterationStepId }]
      
    }
})),
on(sendMessageToLLMExplanationTranslator, (state, action): IterativePlanningState => ({
    ...state,
  LLMChatLoadingState: LoadingState.Loading,
  ExplanationLoadingState: LoadingState.Loading
})),
on(sendMessageToLLMExplanationTranslatorSuccess, (state, action): IterativePlanningState => ({
    ...state,
    LLMContext: {
      ...state.LLMContext,
      threadIdET: action.threadId,
      visibleMessages: [...state.LLMContext.visibleMessages, {role: 'sender', content: action.response, iterationStepId: state.selectedIterationStepId}]
    },
    LLMChatLoadingState: LoadingState.Done,
    ExplanationLoadingState: LoadingState.Done
})),
on(sendMessageToLLMExplanationTranslatorFailure, (state): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Done,
    ExplanationLoadingState: LoadingState.Done
})),
on(sendMessageToLLMQTthenGTTranslators, (state, action): IterativePlanningState => ({
    ...state,
  LLMChatLoadingState: LoadingState.Loading,
  ExplanationLoadingState: LoadingState.Loading,
    LLMContext: {
      ...state.LLMContext,
      visibleMessages: [...state.LLMContext.visibleMessages, {role: 'receiver', content: action.question, iterationStepId: state.selectedIterationStepId}]
    }
})),
on(sendMessageToLLMQTthenGTTranslatorsSuccess, (state, action): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Done,
    LLMContext: {
      ...state.LLMContext,
      threadIdQT: action.threadIdQt,
      threadIdGT: action.threadIdGt,
    }
})),
on(sendMessageToLLMQTthenGTTranslatorsFailure, (state): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Done,
    ExplanationLoadingState: LoadingState.Done
})),
on(loadLLMContextSuccess, (state,action): IterativePlanningState=> ({
  ...state,
  LLMContext : action.LLMContext
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
    hardGoals: state.planProperties.data ? Object.values(state.planProperties.data).filter(pp => pp.globalHardGoal).map(pp => pp._id) : [],
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
