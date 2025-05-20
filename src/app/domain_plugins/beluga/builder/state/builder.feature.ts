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
    selectDraggedJig,
    selectSection,
    selectSizeUnit,
    selectTaskState,
    selectDragSource,
    selectFlights,
    selectConfig,
    selectActions,
  } = BuilderFeature;