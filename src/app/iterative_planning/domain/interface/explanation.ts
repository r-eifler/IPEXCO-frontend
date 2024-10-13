import { GlobalExplanation } from "../explanation/explanations";

export type Explanation = {
  iterationStepId: string;
  propertyId: string;
  explanation: GlobalExplanation,
};
