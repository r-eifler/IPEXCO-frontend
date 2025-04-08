import { createAction, props } from "@ngrx/store";
import { EvaluationInstance, EvaluationInstanceBase } from "../domain/evaluation_instance";

// eval instances

export const loadEvaluationInstances = createAction('[competition evaluation] load evaluation instances');
export const loadEvaluationInstancesSuccess = createAction('[competition evaluation] load evaluation instances success', props<{evalInstances: EvaluationInstance[]}>());
export const loadEvaluationInstancesFailure = createAction('[competition evaluation] load  evaluation instances failure',  props<{err: any}>());

export const uploadEvaluationInstance = createAction('[competition evaluation] upload evaluation instance', props<{evalInstance: EvaluationInstanceBase}>());
export const uploadEvaluationInstanceSuccess = createAction('[competition evaluation] upload evaluation instance success', props<{evalInstance: EvaluationInstance}>());
export const uploadEvaluationInstanceFailure = createAction('[competition evaluation] upload  evaluation instance failure',  props<{err: any}>());

export const deleteEvaluationInstance = createAction('[competition evaluation] delete evaluation instance', props<{id: string}>());
export const deleteEvaluationInstanceSuccess = createAction('[competition evaluation] delete evaluation instance success');
export const deleteEvaluationInstanceFailure = createAction('[competition evaluation] delete  evaluation instance failure',  props<{err: any}>());



export const selectEvaluationInstance = createAction('[competition evaluation] select evaluation instances', props<{id: string}>());

