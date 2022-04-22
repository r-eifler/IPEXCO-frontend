import { PlanningTask } from "src/app/interface/plannig-task";

export class Task {
  protected planningTask: PlanningTask;

  constructor(planningTask: PlanningTask) {
    this.planningTask = planningTask;
  }
}
