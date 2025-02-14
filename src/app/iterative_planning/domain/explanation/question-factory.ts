import { StructuredText } from "../interface/explanation-message";
import { QuestionType } from "./explanations";

type Factory<T extends QuestionType> =
  T extends QuestionType.WHY_PLAN ? () => StructuredText :
  T extends QuestionType.HOW_PLAN ? () => StructuredText :
  T extends QuestionType.WHY_NOT_PROPERTY ? (propertyDescription?: string) => StructuredText :
  T extends QuestionType.WHAT_IF_PROPERTY ? (propertyDescription?: string) => StructuredText :
  T extends QuestionType.CAN_PROPERTY ? (propertyDescription?: string) => StructuredText :
  T extends QuestionType.HOW_PROPERTY ? (propertyDescription?: string) => StructuredText :
  never;

export function questionFactory<T extends QuestionType, R extends Factory<T> = Factory<T>>(questionType: T): R {
  switch(questionType) {
    case QuestionType.WHY_PLAN:
      return (() => ({ mainText: 'Why is the selection of enforced goals unsolvable?' })) as R;
    case QuestionType.HOW_PLAN:
      return (() => ({ mainText: 'How can I make it solvable?' })) as R;
    case QuestionType.WHY_NOT_PROPERTY:
      return ((p: string) => ({ mainText: `Why is "${p}" not satisfied?` })) as R;
    case QuestionType.WHAT_IF_PROPERTY:
      return ((p: string) => ({ mainText: `What happens if I enforce "${p}"?` })) as R;
    case QuestionType.CAN_PROPERTY:
      return ((p: string) => ({ mainText: `Can "${p}" be enforced?` })) as R;
    case QuestionType.HOW_PROPERTY:
      return ((p: string) => ({ mainText: `How can "${p}" be satisfied?` })) as R;
  }
  throw new Error("Didn't expect to get here");
}
