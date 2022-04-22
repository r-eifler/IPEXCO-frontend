import { PlanProperty } from "src/app/interface/plan-property/plan-property";
import { DomainSpecification } from "src/app/interface/files/domain-specification";
import { TaskSchema } from "./task-schema";

export class DisplayTask {
  private goalDescription: Map<string, string> = new Map();

  constructor(taskSchema: TaskSchema, domainSpec: DomainSpecification) {
    for (const goalFact of taskSchema.goals) {
      // if (goalFact.goalType === GoalType.goalFact){
      //   this.goalDescription.set(goalFact.name, domainSpec.getGoalDescription(goalFact));
      // } else {
      //   this.goalDescription.set(goalFact.name, goalFact.name) // TODO use natural language
      // }
    }
  }

  getGoalDescription(goal: PlanProperty) {
    return this.goalDescription.get(goal.name);
  }
}
