export interface ExecutionSettings {
  _id?: string;
  maxRuns: number;
  maxQuestionSize: number;
  public: boolean;
  allowQuestions: boolean;
  usePlanPropertyValues: boolean;
}
