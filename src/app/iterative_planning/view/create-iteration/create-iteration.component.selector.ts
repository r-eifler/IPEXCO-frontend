import { createSelector } from "@ngrx/store";

import { selectIterativePlanningProperties, selectIterativePlanningPropertiesList } from "../../state/iterative-planning.selector";

export const selectPlanPropertyIds = createSelector(selectIterativePlanningPropertiesList, properties => properties?.map(({_id}) => _id) ?? []);
