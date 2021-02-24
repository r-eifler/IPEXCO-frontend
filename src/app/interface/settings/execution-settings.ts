export interface PaymentInfo {
  min: number;
  max: number;
  steps: number[];
}


export interface ExecutionSettings {
  _id?: string;
  maxRuns: number;
  maxQuestionSize: number;
  public: boolean;
  allowQuestions: boolean;
  usePlanPropertyValues: boolean;
  useTimer: boolean;
  measureTime: boolean;
  maxTime: number;
  checkMaxUtility: boolean;
  paymentInfo: PaymentInfo;
  showAnimation: boolean;
  introTask: boolean;
}
