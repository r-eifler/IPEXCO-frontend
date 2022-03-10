export interface PaymentInfo {
  min: number;
  max: number;
  steps: number[];
}


export interface ExecutionSettings {
  maxRuns: number;
  maxQuestionSize: number;
  allowQuestions: boolean;
  usePlanPropertyValues: boolean;
  useTimer: boolean;
  measureTime: boolean;
  maxTime: number;
  checkMaxUtility: boolean;
  paymentInfo?: PaymentInfo;
  showAnimation: boolean;
  introTask: boolean;
}

export const defaultExecutionSetting :ExecutionSettings = {
  maxRuns: 100,
  maxQuestionSize: 1,
  allowQuestions: true,
  usePlanPropertyValues: false,
  useTimer: false,
  measureTime: false,
  maxTime: 0,
  checkMaxUtility: false,
  showAnimation: false,
  introTask: false,
  paymentInfo: {min: 0, max: 10, steps:[0.5, 0.75, 1]}
}
