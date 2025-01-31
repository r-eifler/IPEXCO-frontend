import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Demo } from "src/app/project/domain/demo";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { loadDemos, loadDemosSuccess, loadDemoPlanPropertiesSuccess, loadDemo, loadDemoSuccess } from "./demo.actions";
import { Explainer, Planner } from "src/app/global_specification/domain/services";
import { OutputSchema, Prompt } from "src/app/global_specification/domain/prompt";


export interface DemoState {
    demos: Loadable<Demo[]>;
    demoProperties: Record<string, PlanProperty[]>
    demo: Loadable<Demo>;
    planners: Loadable<Planner[]>;
    explainer: Loadable<Explainer[]>;
    prompts: Loadable<Prompt[]>;
    outputSchemas: Loadable<OutputSchema[]>;
}

const initialState: DemoState = {
    demos: {state: LoadingState.Initial, data: undefined},
    demoProperties: {},
    demo: {state: LoadingState.Initial, data: undefined},
    planners: { state: LoadingState.Initial, data: undefined },
    explainer: { state: LoadingState.Initial, data: undefined },
    prompts: { state: LoadingState.Initial, data: undefined },
    outputSchemas: { state: LoadingState.Initial, data: undefined },
}


export const demoReducer = createReducer(
    initialState,
    on(loadDemos, (state): DemoState => ({
        ...state,
        demos: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadDemosSuccess, (state, {demos}): DemoState => ({
        ...state,
        demos: {state: LoadingState.Done, data: demos},
        demo: state?.demo.state == LoadingState.Done ?
            {state: LoadingState.Done, data: demos.find(demo => demo._id == state.demo.data._id)} :
            {state: LoadingState.Initial, data: undefined}
    })),
    on(loadDemoPlanPropertiesSuccess, (state,{demoId, planProperties}): DemoState => ({
        ...state,
        demoProperties: {...state.demoProperties, [demoId]: planProperties}
    })),
    on(loadDemo, (state): DemoState => ({
        ...state,
        demo: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadDemoSuccess, (state, {demo}): DemoState => ({
        ...state,
        demo: {state: LoadingState.Done, data: demo},
    })),
);

