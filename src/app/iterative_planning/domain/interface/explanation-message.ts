import { QuestionType } from "../explanation/explanations";

export type Role = 'system' | 'user';

export type ExplanationMessage = {
  iterationStepId: string;
  message: string;
  planPropertyId?: string;
  questionType: QuestionType;
  role: Role;
};

