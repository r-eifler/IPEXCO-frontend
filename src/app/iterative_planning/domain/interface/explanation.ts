import { GlobalExplanation } from "../explanation/explanations";

export interface Explanation {
  iterationStepId: string;
  propertyId: string;
  explanation: GlobalExplanation,
}
