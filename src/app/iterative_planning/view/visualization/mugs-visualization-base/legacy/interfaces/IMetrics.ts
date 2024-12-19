import * as d3 from 'd3';

interface IMetric {
  name: string;
  code: string;
  color: d3.ScaleSequential<string>;
}

interface IMetrics {
  occurr: IMetric;
  nOccurr: IMetric;
  solvability: IMetric;
  pearson: IMetric;
  jaccard: IMetric;
}

export {IMetrics, IMetric}
