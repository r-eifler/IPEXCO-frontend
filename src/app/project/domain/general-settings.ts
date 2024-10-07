export interface PaymentInfo {
  min: number;
  max: number;
  steps: number[];
}

export enum PropertyCreationInterfaceType {
  TEMPLATE_BASED = "TEMPLATE_BASED",
  LLM_CHAT = "LLM_CHAT",
}

export enum ExplanationInterfaceType {
  TEMPLATE_QUESTION_ANSWER = "TEMPLATE_QUESTION_ANSWER",
  MUGS_VISUALIZATION = "MUGS_VISUALIZATION",
  LLM_CHAT = "LLM_CHAT",
}

export interface GeneralSettings {
  _id: string|number;
  public: boolean;
  maxRuns: number;
  allowQuestions: boolean;
  usePlanPropertyUtility: boolean;
  useTimer: boolean;
  measureTime: boolean;
  maxTime: number;
  checkMaxUtility: boolean;
  showPaymentInfo: boolean;
  paymentInfo?: PaymentInfo;
  introTask: boolean;
  computePlanAutomatically: boolean;
  computeDependenciesAutomatically: boolean;
  propertyCreationInterfaceType: PropertyCreationInterfaceType;
  explanationInterfaceType: ExplanationInterfaceType;
  globalExplanation: boolean;
}

export const defaultGeneralSetting: GeneralSettings = {
  _id: 0,
  public: false,
  maxRuns: 100,
  allowQuestions: true,
  usePlanPropertyUtility: false,
  explanationInterfaceType: ExplanationInterfaceType.TEMPLATE_QUESTION_ANSWER,
  propertyCreationInterfaceType: PropertyCreationInterfaceType.TEMPLATE_BASED,
  globalExplanation: false,
  useTimer: false,
  measureTime: false,
  maxTime: 0,
  checkMaxUtility: false,
  introTask: false,
  computePlanAutomatically: false,
  computeDependenciesAutomatically: false,
  showPaymentInfo: false,
  paymentInfo: { min: 0, max: 10, steps: [0.5, 0.75, 1] },
};
