import state from './state.js';
import * as d3 from 'd3';
import {ISourceData} from './interfaces/IState';
import {defaultDataObject, IDataObject} from './interfaces/IDataObject';
import {Utils} from './utils';
import {VectorMetrics} from './vector-metrics';
import {PlanRunStatus} from '../../../../domain/plan';
import {PlanProperty} from '../../../../../shared/domain/plan-property/plan-property';


export class DataHandlerService {
  public stepType: PlanRunStatus;

  constructor() {}

  /**
   * Extract a list of unique elements present in the given list of sets.
   *
   * @param {*} sets A list of sets.
   * @returns A list of unique string elements.
   */
  public getElements(sets: string[][]): string[] {
    return sets.length > 0 ?
      [...sets.map(d => new Set(d)).reduce((p, c) => new Set([...c, ...p]))] :
      [];
  }

  /**
   * Prepare a data object by extracting the set elements and mapping sets to usable data structures.
   *
   * @param {*} source The source data.
   * @returns The data object.
   */
  public getDataObj(source: ISourceData) {
    let data: IDataObject = defaultDataObject;

    data["types"] = Object.assign({}, source.types);

    // data.elements = this.getElements(source.MUGS);
    data.elements = source.elements;

    // Prepare Minimally Unsolvable Goal Subsets (MUGS).
    data.MUGS = source.MUGS ? source.MUGS.map((mugs, i) => {
      return { i, l: mugs.slice(), s: new Set(mugs) }
    }) : [];

    // Prepare Maximally Solvable Goal Subsets (MSGS).
    data.MSGS = source.MSGS ? source.MSGS.map((msgs, i) => {
      return { i, l: msgs.slice(), s: new Set(msgs) }
    }) : [];

    // Store the original order of elements as (name, index) pairs.
    data.elements.forEach((d_x, i_x) => {
      data.original[d_x.name] = i_x;
    });

    return data;
  }

  public restoreData(data: IDataObject) {
    const source = state.sourceData;

    data.elements = source.elements;
    data.selectedElements = [];

    // Prepare Minimally Unsolvable Goal Subsets (MUGS).
    data.MUGS = source.MUGS ? source.MUGS.map((mugs, i) => {
      return { i, l: mugs.slice(), s: new Set(mugs) }
    }) : [];

    // Prepare Maximally Solvable Goal Subsets (MSGS).
    data.MSGS = source.MSGS ? source.MSGS.map((msgs, i) => {
      return { i, l: msgs.slice(), s: new Set(msgs) }
    }) : [];

    // Store the original order of elements as (name, index) pairs.
    data.original = {};
    data.elements.forEach((d_x, i_x) => {
      data.original[d_x.name] = i_x;
    });
  }

  // Computes element counts and metrics based on current element order.
  public computeOrderDependentValues(data: IDataObject): void {
    data.matrix = [];
    data.occurrence = {};

    data.onehots = {};
    data.elements.forEach((d_x, i_x) => {
      data.occurrence[d_x.name] = {};
      data.onehots[d_x.name] = [];
      data.elements.forEach((d_y, i_y) => {
        data.matrix.push({
          x: d_x.name,
          y: d_y.name,
        })
        if (d_x.name !== d_y.name) {
          data.occurrence[d_x.name][d_y.name] = 0;
        }
      });

    });
    data.maxOccurrence = 0;
    data.counts = {};

    data.MUGS.forEach((mugs, i) => {
      mugs.l.forEach(d => {
        data.elements.forEach(e => {
          if (data.onehots[e.name].length < i+1) {
            data.onehots[e.name].push(0);
          }

          if (d === e.name) {
            data.onehots[e.name][i] = 1;
          }
        })

        if (data.counts[d]) {
          data.counts[d] += 1;
        } else {
          data.counts[d] = 1;
        }

        mugs.l.forEach(o => {
          if (d !== o) {
            // Compute the occurence count of each pair of elements.
            data.occurrence[d][o] += 1
            data.maxOccurrence = Math.max(data.maxOccurrence, data.occurrence[d][o]);
          }
        });

      });
    });

    // Attention: Some correlation or distance metrics will produce NaNs for certain combinations of binary vectors.
    // Binary vectors which contain entirely 0s or 1s are not supported by most correlation metrics. However, these
    // scenarios should not appear in our case.
    data.matrix.forEach(d => {
      const ox = data.onehots[d.x];
      const oy = data.onehots[d.y];

      d.corr = {};
      d.corr.occurr = data.occurrence[d.x][d.y];
      d.corr.nOccurr = data.occurrence[d.x][d.y] / data.maxOccurrence;
      d.corr.solvability = Utils.computeSolvabilityFraction(data.elements, data.MSGS, [d.x, d.y]);
      d.corr.distance = d.x !== d.y ? VectorMetrics.distanceCorrelation(ox, oy) : 0;
      d.corr.pearson = d.x !== d.y ? VectorMetrics.pearsonCorrelation(ox, oy) : 0;
      d.corr.jaccard = d.x !== d.y ? VectorMetrics.jaccardIndex(ox, oy) : 0;
    })

    data.extents = {
      occurr: [undefined, undefined],
      nOccurr: [undefined, undefined],
      solvability: [undefined, undefined],
      distance: [undefined, undefined],
      pearson: [undefined, undefined],
      jaccard: [undefined, undefined],
    };

    data.extents.occurr = d3.extent(data.matrix.map(d => d.corr.occurr));
    data.extents.nOccurr = d3.extent(data.matrix.map(d => d.corr.nOccurr));
    data.extents.solvability = d3.extent(data.matrix.map(d => d.corr.solvability));
    data.extents.distance = d3.extent(data.matrix.map(d => d.corr.distance));
    data.extents.pearson = d3.extent(data.matrix.map(d => d.corr.pearson)); // use full extent of the color scale. Use [-1, 1] for normalized
    const highest = Math.max(...data.extents.pearson.map(Math.abs))
    data.extents.pearson = [-1 * highest, highest]; //center the color scale
    data.extents.jaccard = d3.extent(data.matrix.map(d => d.corr.jaccard));
  }

  /**
   * Test if the final set of enforced goals is solvable.
   *
   * A set of goals is solvable when the following conditions are met:
   * - It is a superset of a MUGS from the original unfiltered data.
   * - It is a subset of a MSGS from the original unfiltered data.
   *
   * @returns An object { result: string, mugs: Array, msgs: Array }.
   */
  public computeSolvability(data: IDataObject): { result: string, mugs: string[], msgs: string[], counts: {} } {
    const originalData = this.getDataObj(state.sourceData);
    let { selectedElements } = data;

    const MUGS = originalData.MUGS.map(mugs => mugs.s);
    const MSGS = originalData.MSGS.map(msgs => msgs.s);
    MSGS.sort((a, b) => a.size - b.size);
    MUGS.sort((a, b) => a.size - b.size);

    let foundMUGS: string[] = [];
    let foundMSGS: string[] = [];
    let elementCounts: Record<string, number> = {};
    let result: string;

    if (this.stepType == PlanRunStatus.not_solvable){
      selectedElements = originalData.elements.filter(element => !selectedElements.some(selected => selected.name === element.name));
    }

    MUGS.forEach(mugs => {
      // Check if the mugs is a subset of the enforced elements.
      if(selectedElements.filter(element => mugs.has(element.name)).length === mugs.size) {
        if(foundMUGS.length === 0)
          foundMUGS = [...mugs];
        mugs.forEach(element => elementCounts[element] = (elementCounts[element] || 0) + 1);
      }
    });

    MSGS.forEach(msgs => {
      if(selectedElements.filter(element => msgs.has(element.name)).length === selectedElements.length) {
        foundMSGS = [...msgs];
        return;
      }
    });

    if(foundMUGS.length === 0) {
      if(foundMSGS.length === 0) {
        result = "undecided";
      } else {
        result = "solvable";
      }
    } else {
      if(foundMSGS.length === 0) {
        result = "unsolvable";
      } else {
        result = "undecided";
      }
    }
    return { result, mugs: foundMUGS, msgs: foundMSGS, counts: elementCounts };
  }

  public setElementSelection(data: IDataObject, elements: PlanProperty[]): void {
    data.elements = data.elements.filter(element =>
      !elements.some(e => e.name === element.name)
    );

    // Remove elements from all MUGS
    data.MUGS.forEach(mugs => {
      elements.forEach(element => mugs.s.delete(element.name));
      mugs.l = Array.from(mugs.s);
    });

    // Remove now empty MUGS
    data.MUGS = data.MUGS.filter(mugs => mugs.l.length > 0);

    // Filter duplicate MUGS
    data.MUGS = Utils.uniq(data.MUGS, (a, b) => Utils.setEquals(a.s, b.s));

    data.selectedElements = data.selectedElements.concat(elements);

    data.MSGS.forEach(msgs => {
      elements.forEach(element => msgs.s.delete(element.name));
      msgs.l = Array.from(msgs.s);
    });

    const len = data.MSGS.length;
    data.MSGS = data.MSGS.filter(msgs => msgs.l.length > 0);
    if(len > data.MSGS.length) {
      //console.log("Warning: MSGS removed.");
    }

    // Filter duplicate MSGS
    data.MSGS = Utils.uniq(data.MSGS, (a, b) => Utils.setEquals(a.s, b.s));

    data.original = {};
    data.elements.forEach((d_x, i_x) => {
      data.original[d_x.name] = i_x;
    });

    this.computeOrderDependentValues(data);
  }

}


