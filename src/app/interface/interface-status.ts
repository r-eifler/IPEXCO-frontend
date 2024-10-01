

export interface FinishedStepInterfaceStatus {
  _id: string;
  tab: number;
  viewPos: number;
  question: string;
  conflict: any;
  dependencies: any;
}

export interface NewStepInterfaceStatus {
  _id: string;
  stepperStep: number;
}
