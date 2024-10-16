import { QuestionType } from "../explanation/explanations";

export type Question = {
  iterationStepId: string,
  propertyId?: string,
  questionType: QuestionType,
};
