import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Demo } from "src/app/project/domain/demo";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { loadDemos, loadDemosSuccess, loadDemoPlanPropertiesSuccess, loadDemo, loadDemoSuccess } from "./demo.actions";


export interface DemoState {
    demos: Loadable<Demo[]>;
    demoProperties: Record<string, PlanProperty[]>
    demo: Loadable<Demo>;
}

export const demoFeature = 'demo';

const initialState: DemoState = {
    demos: {state: LoadingState.Initial, data: undefined},
    demoProperties: {},
    demo: {state: LoadingState.Initial, data: undefined},
}


export const DemoReducer = createReducer(
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