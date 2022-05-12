export interface PaymentInfo {
  min: number;
  max: number;
  steps: number[];
}

export interface ExecutionSettings {
  _id: string|number;
  public: boolean;
  maxRuns: number;
  allowQuestions: boolean;
  provideRelaxationExplanations: boolean;
  usePlanPropertyValues: boolean;
  useTimer: boolean;
  measureTime: boolean;
  maxTime: number;
  checkMaxUtility: boolean;
  showPaymentInfo: boolean;
  paymentInfo?: PaymentInfo;
  showAnimation: boolean;
  introTask: boolean;
  computePlanAutomatically: boolean;
  computeDependenciesAutomatically: boolean;
}

export const defaultExecutionSetting: ExecutionSettings = {
  _id: 0,
  public: false,
  maxRuns: 100,
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
  showPaymentInfo: false,
  paymentInfo: { min: 0, max: 10, steps: [0.5, 0.75, 1] },
};
