export enum GoalType {
  goalFact= 'G',
  planProperty = 'P'
}

export class Goal {
  name: string;
  goalType: GoalType;
}
