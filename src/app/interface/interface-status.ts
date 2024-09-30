import { PPConflict, PPDependencies } from "../iterative_planning/domain/explanations";


export interface FinishedStepInterfaceStatus {
  _id: string;
  tab: number;
  viewPos: number;
  question: string;
  conflict: PPConflict;
  dependencies: PPDependencies;
}

export interface NewStepInterfaceStatus {
  _id: string;
  stepperStep: number;
}
