import { createReducer, on } from "@ngrx/store";
import { Project } from "src/app/project/domain/project";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { IterationStep, ModIterationStep, StepStatus } from "../domain/iteration_step";
import { PlanProperty } from "../domain/plan-property/plan-property";
import { createIterationStepSuccess, deselectIterationStep, initNewIterationStep, loadIterationSteps, loadIterationStepsSuccess, loadPlanProperties, loadPlanPropertiesSuccess, loadProject, loadProjectSuccess, selectIterationStep, updateNewIterationStep } from "./iterative-planning.actions";


export interface IterativePlanningState {
    project: Loadable<Project>;
    planProperties: Loadable<Record<string, PlanProperty>>
    iterationSteps: Loadable<IterationStep[]>
    selectedIterationStepId: undefined | string
    newStep: undefined | ModIterationStep
}

export const iterativePlanningFeature = 'iterative-planning';

const initialState: IterativePlanningState = {
    project: {state: LoadingState.Initial, data: undefined},
    planProperties: {state: LoadingState.Initial, data: undefined},
    iterationSteps: {state: LoadingState.Initial, data: undefined},
    selectedIterationStepId: undefined,
    newStep: undefined
}


export const iterativePlanningReducer = createReducer(
    initialState,
    on(loadProject, (state): IterativePlanningState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectSuccess, (state, {project}): IterativePlanningState => ({
        ...state,
        project: {state: LoadingState.Done, data: project}
    })),
    on(loadPlanProperties, (state): IterativePlanningState => ({
        ...state,
        planProperties: {state: LoadingState.Loading, data: state.planProperties.data}
    })),
    on(loadPlanPropertiesSuccess, (state, {planProperties}): IterativePlanningState => ({
        ...state,
        planProperties: {state: LoadingState.Done, data: planProperties},
        newStep: state.iterationSteps.state == LoadingState.Done && state.iterationSteps.data.length == 0 ? initFirstNewIterationStep(state) : state.newStep
    })),
    on(loadIterationSteps, (state): IterativePlanningState => ({
        ...state,
        iterationSteps: {state: LoadingState.Loading, data: state.iterationSteps.data}
    })),
    on(loadIterationStepsSuccess, (state, {iterationSteps}): IterativePlanningState => ({
        ...state,
        iterationSteps: {state: LoadingState.Done, data: iterationSteps},
        newStep: iterationSteps.length == 0 && state.planProperties.state == LoadingState.Done ? initFirstNewIterationStep(state) : undefined,
    })),
    on(createIterationStepSuccess, (state): IterativePlanningState => ({
        ...state,
        newStep: undefined,
    })),
    on(initNewIterationStep, (state, {baseStepId}): IterativePlanningState => {
      const baseStep = state.iterationSteps.data?.find(({_id}) => _id === baseStepId);

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
              explanations: []
          },
      }
    }),
    on(updateNewIterationStep, (state, {iterationStep}): IterativePlanningState => ({
        ...state,
        newStep: iterationStep,
    })),
    on(selectIterationStep, (state, {iterationStepId}): IterativePlanningState => ({
        ...state,
        selectedIterationStepId: iterationStepId,
    })),
    on(deselectIterationStep, (state): IterativePlanningState => ({
        ...state,
        selectedIterationStepId: undefined,
    }))
);


function initFirstNewIterationStep(state: IterativePlanningState): ModIterationStep {
    return {
        _id: undefined,
        name:"Iteration Step 1",
        baseStep: null,
        task: state.project.data.baseTask,
        status: StepStatus.unknown,
        project: state.project.data._id,
        hardGoals: Object.values(state.planProperties.data).filter(p => p.globalHardGoal).map(p => p._id),
        softGoals: [],
        predecessorStep: undefined,
        explanations: []
    }
}
