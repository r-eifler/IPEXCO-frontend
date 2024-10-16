import { QuestionType } from "../explanation/explanations";

export type Role = 'system' | 'user';

export type StructuredText = {
  includeComputation?: boolean;
  mainText: string;
  setPrefix?: string;
  setSuffix?: string;
  setConnector?: string;
  topLevelPrefix?: string;
  topLevelConnector?: string;
}

export type ExplanationMessage = {
  iterationStepId: string;
  message: StructuredText;
  propertyId?: string;
  questionType: QuestionType;
  role: Role;
  conflictSets?: string[][];
};

