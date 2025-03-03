import {PlanProperty} from '../../../../../shared/domain/plan-property/plan-property';

export interface IDataObject {
  MUGS: Record<string, any>[];
  elements: PlanProperty[];
  elementsName: string[]
}
