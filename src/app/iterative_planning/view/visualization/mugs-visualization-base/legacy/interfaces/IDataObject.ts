interface IDataObject {
  MSGS: Record<string, any>[];
  MUGS: Record<string, any>[];
  counts: Record<string, number>;
  elements: string[];
  enforcedElements: string[];
  extents: {
    occurr: [number | undefined, number | undefined];
    nOccurr: [number | undefined, number | undefined];
    solvability: [number | undefined, number | undefined];
    distance: [number | undefined, number | undefined];
    pearson: [number | undefined, number | undefined];
    jaccard: [number | undefined, number | undefined];
    [key: string]: [number | undefined, number | undefined]; // ... to allow for addition metrics
  };
  matrix: any[];
  maxOccurrence: number;
  occurrence: Record<string, any>;
  onehots: Record<string, any>;
  original: Record<string, any>;
  types: Record<string, number>;
}

const defaultDataObject: IDataObject = {
  MSGS: [],
  MUGS: [],
  counts: {},
  elements: [],
  enforcedElements: [],
  extents: {
    occurr: [undefined, undefined],
    nOccurr: [undefined, undefined],
    solvability: [undefined, undefined],
    distance: [undefined, undefined],
    pearson: [undefined, undefined],
    jaccard: [undefined, undefined],
  },
  matrix: [],
  maxOccurrence: 0,
  occurrence: {},
  onehots: {},
  original: {},
  types: {},
};


export {IDataObject, defaultDataObject}
