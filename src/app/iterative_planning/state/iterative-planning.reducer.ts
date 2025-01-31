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
    createLLMContext,
    createLLMContextSuccess,
    deselectIterationStep,
    directResponseQT,
    eraseLLMHistory,
    initNewIterationStep,
    loadDomainSpecification,
    loadDomainSpecificationSuccess,
    loadIterationSteps,
    loadIterationStepsSuccess,
    loadLLMContextSuccess,
    loadPlanProperties,
    loadPlanPropertiesSuccess,
    loadProject,
    loadProjectSuccess,
    poseAnswer,
    questionPosed,
    selectIterationStep,
    sendMessageToLLMExplanationTranslator,
    showReverseTranslationGT,
    showReverseTranslationQT,
} from "./iterative-planning.actions";
import {
  sendMessageToLLMGoalTranslator,
  sendMessageToLLMGoalTranslatorSuccess,
  sendMessageToLLMExplanationTranslatorSuccess,
  sendMessageToLLMExplanationTranslatorFailure,
  // sendMessageToLLMQTthenGTTranslators,
  // sendMessageToLLMQTthenGTTranslatorsSuccess,
  // sendMessageToLLMQTthenGTTranslatorsFailure,
  sendMessageToLLMQuestionTranslator,
  sendMessageToLLMQuestionTranslatorSuccess,
  sendMessageToLLMQuestionTranslatorFailure,
} from "./iterative-planning.actions";
import { LLMContext } from "src/app/LLM/domain/context";
import { Project } from "src/app/shared/domain/project";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { llmStateChangeFunctions } from "./iterative-planning.llm.reducer";

type messageType = ExplanationMessage['message'];
export type Message = (Omit<ExplanationMessage, 'message'> & { message?: messageType });

export interface LLMMessage{
  role: 'sender' | 'receiver',
  content: string
}

export interface IterativePlanningState {
  explanations: Record<string,GlobalExplanation | undefined>;
  iterationSteps: Loadable<IterationStep[]>;
  messages: Message[] 
  newStepBase: undefined | string;
  createStepInterfaceOpen: boolean;
  createdStep: undefined | string;
  planProperties: Loadable<Record<string, PlanProperty>>;
  project: Loadable<Project>;
  domainSpecification: Loadable<DomainSpecification>;
  propertyAvailableQuestionTypes: QuestionType[];
  selectedIterationStepId: undefined | string;
  stepAvailableQuestionTypes: QuestionType[];
  LLMChatLoadingState: LoadingState;
  ExplanationLoadingState: LoadingState;
  LLMContext: LLMContext;

}


const initialState: IterativePlanningState = {
  explanations: {},
  iterationSteps: { state: LoadingState.Initial, data: undefined },
  messages: [],
  createdStep: undefined,
  createStepInterfaceOpen: false,
  newStepBase: undefined,
  planProperties: { state: LoadingState.Initial, data: undefined },
  project: { state: LoadingState.Initial, data: undefined },
  domainSpecification: { state: LoadingState.Initial, data: undefined },
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
  on(loadDomainSpecification, (state): IterativePlanningState => ({
          ...state,
          domainSpecification: {state: LoadingState.Loading, data: undefined},
  })),
  on(loadDomainSpecificationSuccess, (state, {domainSpecification}): IterativePlanningState => ({
      ...state,
      domainSpecification: {state: LoadingState.Done, data: domainSpecification}
  })),
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
      planProperties: { state: LoadingState.Done, data: planProperties }
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
      explanations: extractExplanations(iterationSteps),
    })
  ),
  on(
    createIterationStepSuccess,
    (state, {iterationStep}): IterativePlanningState => ({
      ...state,
      createdStep: iterationStep._id,
      newStepBase: undefined,
      createStepInterfaceOpen: false
    })
  ),
  on(
    initNewIterationStep,
    (state, {baseStepId}): IterativePlanningState => ({
      ...state,
      newStepBase: baseStepId,
      createStepInterfaceOpen: true
    })
  ),
  on(
    cancelNewIterationStep,
    (state): IterativePlanningState => ({
      ...state,
      newStepBase: undefined,
      createStepInterfaceOpen: false
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
  ...llmStateChangeFunctions,
);



function extractExplanations(iterationSteps: IterationStep[]): Record<string,GlobalExplanation | undefined> {
  return pipe(
    map(extractExplanation),
    reduce((acc, curr) => ({ ...acc, ...curr}), {}),
  )(iterationSteps);
}

function extractExplanation(iterationStep: IterationStep): Record<string,GlobalExplanation | undefined> {
  if(!iterationStep){
    return undefined;
  }

  const hash = explanationHash(iterationStep);

  return {
    [hash]: iterationStep.globalExplanation,
  }
}
