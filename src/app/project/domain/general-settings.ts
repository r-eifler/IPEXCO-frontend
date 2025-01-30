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
  _id: string;
  main: {
      public: boolean;
      maxRuns: number;
      usePlanPropertyUtility: boolean;
  }
  services: {
      computePlanAutomatically: boolean;
      computeExplanationsAutomatically: boolean;
      planners: string[];
      explainer: string[]
  }
  interfaces: {
      propertyCreationInterfaceType: PropertyCreationInterfaceType;
      explanationInterfaceType: ExplanationInterfaceType;
  }
  llmConfig: {
    model: string,
    temperature: number,
    maxCompletionTokens: number| null,
    prompts: string[],
    outputSchema: string[],
}
  userStudy: {
      introTask: boolean;
      checkMaxUtility: boolean;
      showPaymentInfo: boolean;
      paymentInfo?: PaymentInfo;
  }
}

export const defaultGeneralSetting: GeneralSettings = {
  _id: '0',
  main: {
    public: false,
    maxRuns: 100,
    usePlanPropertyUtility: false,
  },
  services: {
      computePlanAutomatically: true,
      computeExplanationsAutomatically: true,
      planners: [],
      explainer: [],
  },
  interfaces: {
      explanationInterfaceType: ExplanationInterfaceType.TEMPLATE_QUESTION_ANSWER,
      propertyCreationInterfaceType: PropertyCreationInterfaceType.TEMPLATE_BASED,
  },
  llmConfig: {
    model: 'gpt-4o-mini',
    temperature: 0,
    maxCompletionTokens: null,
    prompts: [],
    outputSchema: [],
  },
  userStudy: {
      introTask: false,
      checkMaxUtility: true,
      showPaymentInfo: false,
      paymentInfo: { min: 0, max: 10, steps: [0.5, 0.75, 1] }
  }
};
