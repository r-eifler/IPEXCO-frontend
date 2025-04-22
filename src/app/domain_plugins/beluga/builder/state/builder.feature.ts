import { createFeature } from "@ngrx/store";
import { HomeReducer } from "./builder.reducer";


export const BuilderFeature = createFeature({
    name: 'builderFeature',
    reducer: HomeReducer
});

export const {
    name,
    reducer,
    selectProject,
    selectBuilderFeatureState,
    selectCurrentSection,
    selectDraggedJig,
    selectPlan,
    selectSizeUnit,
    selectTask,
    selectTaskState,
    selectDragSource,
  } = BuilderFeature;