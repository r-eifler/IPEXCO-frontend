export interface ExecutionSettings {
  _id?: string;
  maxRuns: number;
  maxQuestionSize: number;
  public: boolean;
  allowQuestions: boolean;
  usePlanPropertyValues: boolean;
  useTimer: boolean;
  measureTime: boolean;
  maxTime: number;
  showAnimation: boolean;
}
