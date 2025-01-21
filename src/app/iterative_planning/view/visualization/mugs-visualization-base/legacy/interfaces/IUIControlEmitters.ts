import {PlanProperty} from '../../../../../../shared/domain/plan-property/plan-property';

export interface ISelectionChangeEmitter {
  planProperties: PlanProperty[];
  criticalityMapping: Record<string, string>
}
