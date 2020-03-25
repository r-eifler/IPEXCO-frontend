import { PlanProperty} from './plan-property';

export interface PropertyDependency {
  id: number;
  alternative: PlanProperty[];
  consequence: PlanProperty[];
}
