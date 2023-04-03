export interface PaymentInfo {
  min: number;
  max: number;
  steps: number[];
}

export enum ExplanationInterfaceType {
  QUETSIONANSWER = "question_answer",
  MUGSVISU = "mugs_visualization"
}

export interface GeneralSettings {
  _id: string|number;
  public: boolean;
  maxRuns: number;
  allowQuestions: boolean;
  provideRelaxationExplanations: boolean;
  usePlanPropertyValues: boolean;
  useConstraints: boolean;
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
  explanationInterface: ExplanationInterfaceType;
  globalExplanation: boolean;
}

export const defaultGeneralSetting: GeneralSettings = {
  _id: 0,
  public: false,
  maxRuns: 100,
  allowQuestions: true,
  provideRelaxationExplanations: true,
  usePlanPropertyValues: false,
  useConstraints: false,
  explanationInterface: ExplanationInterfaceType.QUETSIONANSWER,
  globalExplanation: false,
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
