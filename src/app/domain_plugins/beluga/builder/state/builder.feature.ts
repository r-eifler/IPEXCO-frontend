import { createFeature } from "@ngrx/store";
import { BuilderReducer } from "./builder.reducer";


export const BuilderFeature = createFeature({
    name: 'BuilderFeature',
    reducer: BuilderReducer
});

export const {
    name,
    reducer,
    selectBuilderFeatureState,
    selectCurrentSection,
    selectDraggedJig,
    selectPlan,
    selectSizeUnit,
    selectTaskState,
    selectDragSource,
  } = BuilderFeature;