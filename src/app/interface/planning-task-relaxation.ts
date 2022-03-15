import { Fact } from "./plannig-task"

export interface PlanningTaskRelaxation {
  init: Fact[];
  upper: PlanningTaskRelaxation[];
  lower: PlanningTaskRelaxation[];
}
