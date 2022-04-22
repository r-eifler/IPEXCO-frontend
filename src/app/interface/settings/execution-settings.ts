export interface PaymentInfo {
  min: number;
  max: number;
  steps: number[];
}


export interface ExecutionSettings {
  public: boolean;
  maxRuns: number;
  maxQuestionSize: number;
  allowQuestions: boolean;
  provideRelaxationExplanations: boolean;
  usePlanPropertyValues: boolean;
  useTimer: boolean;
  measureTime: boolean;
  maxTime: number;
  checkMaxUtility: boolean;
  paymentInfo?: PaymentInfo;
  showAnimation: boolean;
  introTask: boolean;
  computePlanAutomatically: boolean;
  computeDependenciesAutomatically: boolean;
}

export const defaultExecutionSetting :ExecutionSettings = {
  public: false,
  maxRuns: 100,
  maxQuestionSize: 1,
  allowQuestions: true,
  provideRelaxationExplanations: true,
  usePlanPropertyValues: false,
  useTimer: false,
  measureTime: false,
  maxTime: 0,
  checkMaxUtility: false,
  showAnimation: false,
  introTask: false,
  computePlanAutomatically: false,
  computeDependenciesAutomatically: false,
  paymentInfo: {min: 0, max: 10, steps:[0.5, 0.75, 1]}
}
