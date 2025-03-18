import {PlanProperty} from '../../../../shared/domain/plan-property/plan-property';

export interface IDataObject {
  MUGS: Record<string, any>[];
  elements: PlanProperty[];
  elementsName: string[]
  counts: Record<string, number>;
}

export const defaultDataObject: IDataObject = {
  MUGS: [],
  elements: [],
  elementsName: [],
  counts: {}
}
