import { createAction, props } from "@ngrx/store";
import { EvaluationInstance } from "../domain/evaluation_instance";

// plan

export const loadEvaluationInstances = createAction('[competition evaluation] load evaluation instances');
export const loadEvaluationInstancesSuccess = createAction('[competition evaluation] load evaluation instances success', props<{evalInstances: EvaluationInstance[]}>());
export const loadEvaluationInstancesFailure = createAction('[competition evaluation] load  evaluation instances failure',  props<{err: any}>());

export const selectEvaluationInstance = createAction('[competition evaluation] select evaluation instances', props<{id: string}>());

