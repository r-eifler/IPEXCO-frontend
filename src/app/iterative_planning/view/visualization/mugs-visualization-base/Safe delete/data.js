import state from "../legacy/state.js";
import * as d3 from 'd3';

/**
 * Extract a list of unique elements present in the given list of sets.
 *
 * @param {*} sets A list of sets.
 * @returns A list of unique elements.
 */
function getElements(sets) {
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
function getDataObj(source) {
  let data = {};

  data.types = Object.assign({}, source.types);

  data.elements = getElements(source.MUGS);

  data.enforcedElements = [];

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
    data.original[d_x] = i_x;
  });

  return data;
}

function restoreData(data) {

  const source = state.sourceData;

  data.elements = getElements(source.MUGS);
  data.enforcedElements = [];

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
    data.original[d_x] = i_x;
  });
}

// Compute the Pearson correlation bewteen two binary encoded varaible vectors.
const pearsonCorrelation = (x, y) => {
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0,
    sumY2 = 0;
  const minLength = x.length = y.length = Math.min(x.length, y.length),
    reduce = (xi, idx) => {
      const yi = y[idx];
      sumX += xi;
      sumY += yi;
      sumXY += xi * yi;
      sumX2 += xi * xi;
      sumY2 += yi * yi;
    }
  x.forEach(reduce);
  return (minLength * sumXY - sumX * sumY) / Math.sqrt((minLength * sumX2 - sumX * sumX) * (minLength * sumY2 - sumY * sumY));
}

/**
 * Count occurences of all possible combinations of binary pairs between the given vectors.
 *
 * For example, n00 contains the number of occurences where both x and y are zero at the same indices.
 *
 * @param {*} x The first binary vector.
 * @param {*} y The second binary vector.
 * @returns An object containing counts of pairs (0,0), (0,1), (1,0) and (1,1).
 */
const pairwiseCounts = (x, y) => {
  const complement = a => a.map(ai => 1 - ai);
  const multiply = (a, b) => a.map((ai, idx) => ai * b[idx]);
  const magnitude = a => a.reduce((s, ai) => s + ai, 0);

  const _x = complement(x);
  const _y = complement(y);

  return {
    n00: magnitude(multiply(_x, _y)),
    n01: magnitude(multiply(_x, y)),
    n10: magnitude(multiply(x, _y)),
    n11: magnitude(multiply(x, y))
  };
}

/**
 * Compute the phi coefficient for two binary vectors.
 *
 * For binary variables this is identical to the Pearson correlation.
 *
 * @param {*} x The first binary vector.
 * @param {*} y The second binary vector.
 * @returns The phi coefficient.
 */
const phiCoefficient = (x, y) => {
  const m = pairwiseCounts(x, y);
  const n0_ = m.n00 + m.n01;
  const n1_ = m.n10 + m.n11;
  const n_0 = m.n00 + m.n10;
  const n_1 = m.n01 + m.n11;

  return (m.n11*m.n00 - m.n10*m.n01) / Math.sqrt(n0_*n1_*n_0*n_1);
}

/**
 * Compute the Jaccard index/coefficient (also known as intersection over union) for two binary vectors.
 *
 * @param {*} x The first binary vector.
 * @param {*} y The second binary vector.
 * @returns The Jaccard index.
 */
const jaccardIndex = (x, y) => {
  const m = pairwiseCounts(x, y);
  return m.n11 / (m.n11 + m.n10 + m.n01);
}

// Combine all unique combinations of length k from elements (recursive implementation)
const computeCombinationsRecursive = (elements, start, end, index, k, data, result) => {
  // Current combination is ready
  if(index === k) {
    result.push(data.slice());
    return;
  }

  // Replace index with all possible elements. The condition "end-i+1 >= k-index"
  // makes sure that including one element at index will make a combination with
  // remaining elements at remaining positions.
  for(let i = start; i <= end && end - i + 1 >= k - index; ++i) {
    data[index] = elements[i];
    computeCombinationsRecursive(elements, i + 1, end, index + 1, k, data, result);
  }
}

// Combine all unique combinations of length k from elements
const computeCombinations = (elements, k) => {
  const data = new Array(k);
  const result = [];
  computeCombinationsRecursive(elements, 0, elements.length - 1, 0, k, data, result);
  return result;
}

const arrayEquals = (a, b) => {
  return a.length === b.length && a.every((e, i) => e === b[i]);
}

const setEquals = (a, b) => {
  if(a.size === b.size) {
    let equal = true;
    a.forEach((key, value) => equal &&= b.has(value) );
    return equal;
  } else {
    return false;
  }
};

/**
 * Compute the solvability of selected goal facts as the fraction
 * of solvable subets over all possible subsets containing those goal facts.
 *
 * @param {*} elements
 * @param {*} MSGS
 * @param {*} selected
 * @returns
 */
const computeSolvabilityFraction = (elements, MSGS, selected) => {

  // Remove duplicates from the selected elements just in case.
  const S = new Set(selected);

  let Ms = MSGS
    .map(msgs => msgs.l.slice()) // Operate on copies of the original lists
    .filter(msgs => msgs.filter(element => S.has(element)).length === S.size) // Get all MSGS that individually contain all of the goal facts in S: M \in MSGS and S \subset M

  // Remove all elements in S from all sets in the filtered list of MSGS: M \ S
  // Additionally sort the lists.
  for(let i = 0; i < Ms.length; ++i) {
    Ms[i] = Ms[i].filter(e => !S.has(e)).sort();
  }

  // Get the number of unique subsets of all sets in Ms. Use a map to
  // store lists of subsets with equal length. This allows to efficiently
  // search for duplicates by limiting the search space to sets of equal
  // size.
  const uniqueSubsets = new Map();

  Ms.forEach(msgs => {
    msgs.forEach((e, i) => {
      const combinations = computeCombinations(msgs, i + 1);

      combinations.forEach(s => {
        // If the set is non-empty we check if it is already contained in uniqueSubsets and if not add it to the list
        if(s.length > 0) {

          // Get the corresponding list of subsets with the required length
          if(!uniqueSubsets.has(s.length))
            uniqueSubsets.set(s.length, []);

          const subsets = uniqueSubsets.get(s.length);

          let contained = false;
          for(let j = 0; j < subsets.length; ++j) {
            // As our arrays represent sets the order of elements does not matter. This would need special care
            // when comparing two arrays but since they are always sorted this is not an issue and we can just
            // call arrayEquals().
            if(arrayEquals(subsets[j], s)) {
              contained = true;
              break;
            }
          }

          if(!contained)
            subsets.push(s);
        }
      });
    });
  });

  // Return count of all unique solvable subsets that contain all goal facts in S.
  let solvableCount = 0;
  uniqueSubsets.forEach(e => solvableCount += e.length);
  // Add one to account for S itself.
  solvableCount += 1;

  // Get the number of all possible unique subsets of elements with the elements in selection fixed (see power set).
  const totalCount = Math.pow(2, elements.length - S.size);

  return solvableCount / totalCount;
}

// Computes element counts and metrics based on current element order.
function computeOrderDependentValues(data) {
  data.matrix = [];
  data.occurrence = {};

  data.onehots = {};
  data.elements.forEach((d_x, i_x) => {
    data.occurrence[d_x] = {};
    data.onehots[d_x] = [];
    data.elements.forEach((d_y, i_y) => {
      data.matrix.push({
        x: d_x,
        y: d_y,
      })
      if (d_x !== d_y) {
        data.occurrence[d_x][d_y] = 0;
      }
    });

  });
  data.maxOccurrence = 0;
  data.counts = {};

  data.MUGS.forEach((mugs, i) => {
    mugs.l.forEach(d => {
      data.elements.forEach(e => {
        if (data.onehots[e].length < i+1) {
          data.onehots[e].push(0);
        }

        if (d === e) {
          data.onehots[e][i] = 1;
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
    d.corr.solvability = computeSolvabilityFraction(data.elements, data.MSGS, [d.x, d.y]);
    d.corr.distance = d.x !== d.y ? distanceCorrelation(ox, oy) : 0;
    d.corr.pearson = d.x !== d.y ? pearsonCorrelation(ox, oy) : 0;
    d.corr.jaccard = d.x !== d.y ? jaccardIndex(ox, oy) : 0;
  })

  data.extents = {};
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
 * A set of goals is solvable when the followin conditions are met:
 * - It is a superset of a MUGS from the original unfiltered data.
 * - It is a subset of a MSGS from the original unfiltered data.
 *
 * @returns An object { result: string, mugs: Array, msgs: Array }.
 */
function computeSolvability(data) {
  const originalData = getDataObj(state.sourceData);

  const { enforcedElements } = data;

  const MUGS = originalData.MUGS.map(mugs => mugs.s);
  MUGS.sort((a, b) => a.size - b.size);

  let foundMUGS = [];
  let elementCounts = {};
  MUGS.forEach(mugs => {
    // Check if the mugs is a subset of the enforced elements.
    if(enforcedElements.filter(element => mugs.has(element)).length === mugs.size) {
      if(foundMUGS.length === 0)
        foundMUGS = [...mugs];
      mugs.forEach(element => elementCounts[element] = (elementCounts[element] || 0) + 1);
    }
  });

  const MSGS = originalData.MSGS.map(msgs => msgs.s);
  MSGS.sort((a, b) => a.size - b.size);

  let foundMSGS = [];
  MSGS.forEach(msgs => {
    if(enforcedElements.filter(element => msgs.has(element)).length === enforcedElements.length) {
      foundMSGS = [...msgs];
      return;
    }
  });

  let result = "";

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

// Remove, i.e exclude, the elements given as an array from the current set of elements and filter the sets accordingly.
function removeElements(data, elements) {

  data.MUGS = data.MUGS.filter(mugs => !elements.filter(a => mugs.s.has(a)).length != 0);
  data.elements = data.MUGS.length > 0 ?
    [...data.MUGS.map(d => d.s).reduce((p, c) => new Set([...c, ...p]))] :
    [];

  const elementsSet = new Set(data.elements);

  data.MSGS.forEach(msgs => {
    msgs.l = msgs.l.filter(e => elementsSet.has(e));
    msgs.s = new Set(msgs.l);
  });
  data.MSGS = data.MSGS.filter(msgs => msgs.l.length > 0);

  data.original = {};
  data.elements.forEach((d_x, i_x) => {
    data.original[d_x] = i_x;
  });

  computeOrderDependentValues(data);
}

const uniq = (array, compareFunc) => {

  let uniques = [];
  array.forEach(element => {
    let found = false;
    for(let i = 0; i < uniques.length; ++i) {
      if(compareFunc(uniques[i], element)) {
        found = true;
        break;
      }
    }

    if(!found)
      uniques.push(element);
  });
  return uniques;
};

function enforceElements(data, elements) {

  data.elements = data.elements.filter(element => !elements.includes(element));

  // Remove elements from all MUGS
  data.MUGS.forEach(mugs => {
    elements.forEach(element => mugs.s.delete(element));
    mugs.l = Array.from(mugs.s);
  });

  // Remove now empty MUGS
  data.MUGS = data.MUGS.filter(mugs => mugs.l.length > 0);

  // Filter duplicate MUGS
  data.MUGS = uniq(data.MUGS, (a, b) => setEquals(a.s, b.s));

  data.enforcedElements = data.enforcedElements.concat(elements);

  data.MSGS.forEach(msgs => {
    elements.forEach(element => msgs.s.delete(element));
    msgs.l = Array.from(msgs.s);
  });

  const len = data.MSGS.length;
  data.MSGS = data.MSGS.filter(msgs => msgs.l.length > 0);
  if(len > data.MSGS.length) {
    // TODO: Should this happen?
    //console.log("Warning: MSGS removed.");
  }

  // Filter duplicate MSGS
  data.MSGS = uniq(data.MSGS, (a, b) => setEquals(a.s, b.s));

  data.original = {};
  data.elements.forEach((d_x, i_x) => {
    data.original[d_x] = i_x;
  });

  computeOrderDependentValues(data);
}


export { getElements, getDataObj, restoreData, computeOrderDependentValues, computeSolvability, removeElements, enforceElements };


