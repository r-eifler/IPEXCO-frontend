import { array, boolean, nativeEnum, nullable, number, object, string, infer as zinfer} from "zod";

export const PaymentInfoZ = object({
  min: number(),
  max: number(),
  steps: array(number())
});

export enum PropertyCreationInterfaceType {
  TEMPLATE_BASED = "TEMPLATE_BASED",
  LLM_CHAT = "LLM_CHAT",
};

export const PropertyCreationInterfaceTypeZ = nativeEnum(PropertyCreationInterfaceType);

export enum ExplanationInterfaceType {
  TEMPLATE_QUESTION_ANSWER = "TEMPLATE_QUESTION_ANSWER",
  MUGS_VISUALIZATION = "MUGS_VISUALIZATION",
  LLM_CHAT = "LLM_CHAT",
  MUGS_VISUALIZATION_ANSWER = "MUGS_VISUALIZATION_ANSWER",
}

export const ExplanationInterfaceTypeZ = nativeEnum(ExplanationInterfaceType);

export const GeneralSettingsZ = object({
  main: object({
      public: boolean(),
      maxRuns: nullable(number()),
      usePlanPropertyUtility: boolean(),
  }),
  services: object({
      computePlanAutomatically: boolean(),
      computeExplanationsAutomatically: boolean(),
      services: array(string()),
  }),
  interfaces: object({
      propertyCreationInterfaceType: PropertyCreationInterfaceTypeZ,
      explanationInterfaceType: ExplanationInterfaceTypeZ,
  }),
  llmConfig: object({
    model: string(),
    temperature: number(),
    maxCompletionTokens: nullable(number()),
    prompts: array(string()),
    outputSchema: array(string()),
  }),
  userStudy: object({
      introTask: boolean(),
      checkMaxUtility: boolean(),
      showPaymentInfo: boolean(),
      paymentInfo: PaymentInfoZ,
  })
})

export type GeneralSettings = zinfer<typeof GeneralSettingsZ>;

export const defaultGeneralSetting: GeneralSettings = {
  main: {
    public: false,
    maxRuns: 100,
    usePlanPropertyUtility: false,
  },
  services: {
      computePlanAutomatically: true,
      computeExplanationsAutomatically: true,
      services: [],
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
