import { Goal } from './goal';
import { DomainSpecification } from 'src/app/interface/domain-specification';
import { TaskSchema } from './task-schema';

export class DisplayTask {

  private goalDescription: Map<string, string> = new Map();

  constructor(taskSchema: TaskSchema, domainSpec: DomainSpecification) {
    for (const goalFact of taskSchema.goals) {
      this.goalDescription.set(goalFact.name, domainSpec.getGoalDescription(goalFact));
    }
  }

  getGoalDescription(goal: Goal) {
    return this.goalDescription.get(goal.name);
  }
}
