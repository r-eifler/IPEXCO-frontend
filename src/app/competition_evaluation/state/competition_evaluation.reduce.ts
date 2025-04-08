import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { EvaluationInstance } from "../domain/evaluation_instance";
import {
    loadEvaluationInstances,
    loadEvaluationInstancesSuccess,
    selectEvaluationInstance
} from "./competition_evaluation.actions";

export interface CompetitionEvaluationState {
    evaluationInstances: Loadable<EvaluationInstance[]>;
    selectedId: string | null
}


const initialState: CompetitionEvaluationState = {
    evaluationInstances: { state: LoadingState.Initial, data: undefined },
    selectedId:  null
}


export const competitionEvaluationReducer = createReducer(
    initialState,
    on(loadEvaluationInstances, (state): CompetitionEvaluationState => ({
        ...state,
        evaluationInstances: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadEvaluationInstancesSuccess, (state, {evalInstances}): CompetitionEvaluationState => ({
        ...state,
        evaluationInstances: {state: LoadingState.Done, data: evalInstances}
    })),
    on(selectEvaluationInstance, (state, {id}): CompetitionEvaluationState => ({
        ...state,
        selectedId: id
    })),
);